interface User {
  image: string
  name: string
}

interface Reply {
  content: string
  replyingTo: string
  user: User
}

interface Comment {
  content: string
  id: string
  replies: Reply[]
  user: User
}

export interface Post {
  category: string
  comments: Comment[]
  description: string
  name: string
  status: string
  title: string
  upvotedBy: string[]
  upvotes: number
}
