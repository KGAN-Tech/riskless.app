import { useState, useEffect } from 'react';
import type { Article } from '@/types/article.types';
import { articleService } from '@/services/article.service';
import { SectionHeader } from '@/components/molecules/shared/section-header';
import { Newspaper } from 'lucide-react';

export const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const data = await articleService.getAll();
        setArticles(data.slice(0, 3));
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader
        variant="icon"
        icon={<Newspaper className="w-6 h-6 mr-2 text-blue-600" />}
        title="News & Articles"
        subtitle="Comprehensive Healthcare Solutions"
        description="Explore our latest news, articles, and wellness advice from our experts."
        rightContent={
          <a href="/articles" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">View All Articles</a>
        }
      />
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {loadingArticles ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group overflow-hidden"
              onClick={() => window.location.href = `/articles/${article.id}`}
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 flex flex-col p-6">
                {article.category && (
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2 w-fit">
                    {article.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-3 flex-1">{article.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>By {article.author.name}</span>
                  <span>{new Date(article.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};