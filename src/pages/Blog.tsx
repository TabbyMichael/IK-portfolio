import React from 'react';
import { event } from '../utils/analytics';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Modern Web Development Best Practices',
    excerpt: 'Exploring the latest trends and best practices in modern web development, including performance optimization and user experience.',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Web Development',
    image: '/assets/blog-1.svg'
  },
  {
    id: '2',
    title: 'The Future of AI in Software Development',
    excerpt: 'Analyzing how artificial intelligence is transforming the software development landscape and what it means for developers.',
    date: '2024-01-10',
    readTime: '4 min read',
    category: 'Artificial Intelligence',
    image: '/assets/blog-2.svg'
  }
];

const Blog: React.FC = () => {
  React.useEffect(() => {
    event({
      action: 'page_view',
      category: 'blog',
      label: 'Blog Page View',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Technical Blog</h1>
          <p className="text-xl text-gray-600 mb-12">Insights, tutorials, and industry perspectives</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sampleBlogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
              onClick={() => {
                event({
                  action: 'blog_post_click',
                  category: 'blog',
                  label: post.title,
                });
              }}
            >
              <div className="h-48 w-full bg-gray-200">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                  {post.category}
                </span>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600">{post.excerpt}</p>
                <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                  Read more →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;