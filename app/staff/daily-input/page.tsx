'use client'

import { useState } from 'react'
import { MessageSquare, Plus, Search, User, Pin, AlertCircle, Heart, ThumbsUp, MessageCircle, Edit2, Trash2, MoreVertical } from 'lucide-react'
import toast from 'react-hot-toast'

interface Post {
  id: string
  title: string
  content: string
  author: string
  authorRole: string
  createdAt: string
  category: 'notice' | 'patient' | 'general' | 'urgent'
  isPinned?: boolean
  patientName?: string
  patientRoom?: string
  likes: number
  comments: Comment[]
  isEditing?: boolean
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

export default function TokTokBoardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as Post['category'],
    patientName: '',
    patientRoom: ''
  })
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const currentUser = '현재 사용자' // 실제 구현시 로그인 사용자 정보 사용

  // 카테고리 정의
  const categories = [
    { id: 'all', name: '전체', icon: MessageSquare, color: 'gray' },
    { id: 'urgent', name: '긴급', icon: AlertCircle, color: 'red' },
    { id: 'notice', name: '공지', icon: Pin, color: 'blue' },
    { id: 'patient', name: '환자', icon: Heart, color: 'green' },
    { id: 'general', name: '일반', icon: MessageCircle, color: 'gray' }
  ]

  // 카테고리 색상 가져오기
  const getCategoryColor = (category: Post['category']) => {
    switch (category) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200'
      case 'notice': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'patient': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // 필터링된 게시물
  const filteredPosts = posts
    .filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })

  // 좋아요 토글
  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  // 새 게시물 작성
  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.content) {
      toast.error('제목과 내용을 입력해주세요')
      return
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: currentUser,
      authorRole: '간호사',
      createdAt: '방금 전',
      category: newPost.category,
      patientName: newPost.patientName,
      patientRoom: newPost.patientRoom,
      likes: 0,
      comments: []
    }

    setPosts(prev => [post, ...prev])
    setNewPost({ title: '', content: '', category: 'general', patientName: '', patientRoom: '' })
    setShowNewPost(false)
    toast.success('게시물이 등록되었습니다')
  }

  // 게시물 수정
  const handleEditPost = (post: Post) => {
    if (post.author !== currentUser) {
      toast.error('본인이 작성한 게시물만 수정할 수 있습니다')
      return
    }
    setEditingPost(post)
    setShowMenu(null)
  }

  // 게시물 수정 저장
  const handleUpdatePost = () => {
    if (!editingPost) return

    if (!editingPost.title || !editingPost.content) {
      toast.error('제목과 내용을 입력해주세요')
      return
    }

    setPosts(prev => prev.map(post =>
      post.id === editingPost.id
        ? { ...editingPost, createdAt: post.createdAt + ' (수정됨)' }
        : post
    ))
    setEditingPost(null)
    toast.success('게시물이 수정되었습니다')
  }

  // 게시물 삭제
  const handleDeletePost = (postId: string, author: string) => {
    if (author !== currentUser) {
      toast.error('본인이 작성한 게시물만 삭제할 수 있습니다')
      return
    }

    if (confirm('정말 삭제하시겠습니까?')) {
      setPosts(prev => prev.filter(post => post.id !== postId))
      toast.success('게시물이 삭제되었습니다')
    }
    setShowMenu(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">톡톡 게시판</h1>
            <p className="text-gray-600 mt-1">직원들 간의 소통과 환자 정보 공유 공간</p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            글쓰기
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="게시물 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">게시물 수정</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as Post['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="general">일반</option>
                  <option value="notice">공지</option>
                  <option value="patient">환자</option>
                  <option value="urgent">긴급</option>
                </select>
              </div>

              {editingPost.category === 'patient' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">환자명</label>
                    <input
                      type="text"
                      value={editingPost.patientName || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, patientName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="환자 이름"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">병실</label>
                    <input
                      type="text"
                      value={editingPost.patientRoom || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, patientRoom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="예: 301호"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="게시물 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={5}
                  placeholder="내용을 입력하세요"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdatePost}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">새 게시물 작성</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value as Post['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="general">일반</option>
                  <option value="notice">공지</option>
                  <option value="patient">환자</option>
                  <option value="urgent">긴급</option>
                </select>
              </div>

              {newPost.category === 'patient' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">환자명</label>
                    <input
                      type="text"
                      value={newPost.patientName}
                      onChange={(e) => setNewPost({ ...newPost, patientName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="환자 이름"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">병실</label>
                    <input
                      type="text"
                      value={newPost.patientRoom}
                      onChange={(e) => setNewPost({ ...newPost, patientRoom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="예: 301호"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="게시물 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={5}
                  placeholder="내용을 입력하세요"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowNewPost(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmitPost}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      {post.isPinned && (
                        <Pin className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{post.author} · {post.authorRole}</span>
                      <span>{post.createdAt}</span>
                      {post.patientName && (
                        <span className="text-primary-600">
                          {post.patientRoom} {post.patientName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                    {categories.find(c => c.id === post.category)?.name}
                  </span>
                  {post.author === currentUser && (
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(showMenu === post.id ? null : post.id)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      {showMenu === post.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit2 className="w-3 h-3" />
                            수정
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id, post.author)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="text-gray-700 mb-4 pl-13">
                {post.content}
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-4 pl-13">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments.length}</span>
                </button>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="space-y-3 pl-13">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                              <span className="text-xs text-gray-500">{comment.createdAt}</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}