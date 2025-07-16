import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Search, 
  BookOpen, 
  Eye, 
  ThumbsUp, 
  Calendar,
  User,
  Plus,
  Filter,
  Star
} from 'lucide-react'

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const articles = [
    {
      id: 'kb-001',
      title: 'How to Reset Your Password',
      content: 'Step-by-step guide to resetting your account password...',
      category: 'Account Management',
      tags: ['password', 'security', 'login'],
      author: { name: 'Sarah Wilson', email: 'sarah@company.com' },
      isPublished: true,
      viewCount: 1247,
      helpfulCount: 89,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-14T15:30:00Z'
    },
    {
      id: 'kb-002',
      title: 'Setting Up Two-Factor Authentication',
      content: 'Enhance your account security with 2FA...',
      category: 'Security',
      tags: ['2fa', 'security', 'authentication'],
      author: { name: 'Mike Johnson', email: 'mike@company.com' },
      isPublished: true,
      viewCount: 892,
      helpfulCount: 67,
      createdAt: '2024-01-08T14:20:00Z',
      updatedAt: '2024-01-12T10:15:00Z'
    },
    {
      id: 'kb-003',
      title: 'Understanding Your Billing Cycle',
      content: 'Learn about subscription billing and payment schedules...',
      category: 'Billing',
      tags: ['billing', 'subscription', 'payment'],
      author: { name: 'Emily Davis', email: 'emily@company.com' },
      isPublished: true,
      viewCount: 634,
      helpfulCount: 45,
      createdAt: '2024-01-05T11:45:00Z',
      updatedAt: '2024-01-13T16:20:00Z'
    },
    {
      id: 'kb-004',
      title: 'API Integration Guide',
      content: 'Complete guide to integrating with our REST API...',
      category: 'Developer',
      tags: ['api', 'integration', 'developer'],
      author: { name: 'Alex Chen', email: 'alex@company.com' },
      isPublished: false,
      viewCount: 156,
      helpfulCount: 12,
      createdAt: '2024-01-15T08:30:00Z',
      updatedAt: '2024-01-15T08:30:00Z'
    },
    {
      id: 'kb-005',
      title: 'Mobile App Features Overview',
      content: 'Discover all the features available in our mobile application...',
      category: 'Features',
      tags: ['mobile', 'features', 'app'],
      author: { name: 'Sarah Wilson', email: 'sarah@company.com' },
      isPublished: true,
      viewCount: 423,
      helpfulCount: 31,
      createdAt: '2024-01-12T13:15:00Z',
      updatedAt: '2024-01-14T09:45:00Z'
    }
  ]

  const categories = ['all', 'Account Management', 'Security', 'Billing', 'Developer', 'Features']

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const popularArticles = articles
    .filter(article => article.isPublished)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Create and manage help articles for your customers</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Articles List */}
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant={article.isPublished ? 'default' : 'secondary'}>
                          {article.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="outline">{article.category}</Badge>
                        {article.viewCount > 500 && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{article.author.name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>{article.viewCount.toLocaleString()} views</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{article.helpfulCount} helpful</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Updated {formatDate(article.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-500">
                    {searchQuery || categoryFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Create your first article to get started'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <div key={article.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {article.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Eye className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {article.viewCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.slice(1).map((category) => {
                  const count = articles.filter(article => article.category === category).length
                  return (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`w-full flex items-center justify-between p-2 text-sm rounded-lg transition-colors ${
                        categoryFilter === category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{category}</span>
                      <Badge variant={categoryFilter === category ? 'secondary' : 'outline'}>
                        {count}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Articles</span>
                  <span className="font-semibold">{articles.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="font-semibold">
                    {articles.filter(a => a.isPublished).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-semibold">
                    {articles.reduce((sum, a) => sum + a.viewCount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Helpful Votes</span>
                  <span className="font-semibold">
                    {articles.reduce((sum, a) => sum + a.helpfulCount, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}