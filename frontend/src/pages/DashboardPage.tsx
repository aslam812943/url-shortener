import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LogOut, Link as LinkIcon, ExternalLink, Copy, Check, History, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../App';
import { urlService } from '../services/url.service';
import type { UrlData } from '../services/url.service';

const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL (including http/https)'),
});

type UrlFormValues = z.infer<typeof urlSchema>;

const LIMIT = 10;

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isShortening, setIsShortening] = useState(false);
  const [links, setLinks] = useState<UrlData[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
  });

  const fetchLinks = async (pageNum: number, isNew: boolean = false) => {
    setIsLoadingMore(true);
    try {
      const data = await urlService.getMyLinks(pageNum, LIMIT);
      if (isNew) {
        setLinks(data);
        setHasMore(data.length === LIMIT);
      } else {
        setLinks(prev => [...prev, ...data]);
        setHasMore(data.length === LIMIT);
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
      toast.error('Failed to load links');
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchLinks(page);
  }, [page]);

  const onSubmit = async (data: UrlFormValues) => {
    setIsShortening(true);
    try {
      await urlService.shorten(data.url);
      toast.success('URL shortened successfully!');
      reset();
     
      setPage(1);
      fetchLinks(1, true);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to shorten URL';
      toast.error(message);
    } finally {
      setIsShortening(false);
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    const shortUrl = `${window.location.protocol}//${window.location.hostname}:4000/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start">
              <LinkIcon className="mr-3 text-blue-500" />
              URL Shortener
            </h1>
            <p className="text-slate-400 mt-1">Welcome back, {user?.name || 'User'}</p>
          </div>
          <div className="w-full md:w-32">
            <Button variant="secondary" onClick={logout}>
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="glass rounded-3xl p-6 md:p-10 mb-12 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Shorten a new URL</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1 w-full">
              <Input
                label="URL to shorten"
                placeholder="Paste your long URL here (e.g., https://example.com/very-long-link)"
                register={register('url')}
                error={errors.url?.message}
                icon={<LinkIcon size={18} />}
              />
            </div>
            <div className="w-full md:w-40 h-[52px] md:pt-[26px]">
              <Button type="submit" isLoading={isShortening} className="h-full">
                Shorten
              </Button>
            </div>
          </form>
        </div>

        <div className="glass rounded-3xl overflow-hidden shadow-xl border border-slate-700/50 mb-12">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
            <h3 className="text-xl font-bold text-white flex items-center">
              <History className="mr-2 text-blue-400" size={20} />
              Recent Links
            </h3>
            <span className="text-slate-400 text-sm">Your shortened history</span>
          </div>
          
          <div className="divide-y divide-slate-700/50">
            {links.length === 0 && !isLoadingMore ? (
              <div className="p-12 text-center text-slate-500">
                <LinkIcon size={48} className="mx-auto mb-4 opacity-20" />
                <p>No links shortened yet. Try one above!</p>
              </div>
            ) : (
              <>
                {links.map((link, index) => (
                  <div 
                    key={link.id} 
                    ref={index === links.length - 1 ? lastElementRef : null}
                    className="p-6 hover:bg-slate-700/20 transition-colors group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <a 
                            href={`${window.location.protocol}//${window.location.hostname}:4000/${link.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 font-bold text-lg hover:text-blue-300 transition-colors break-all"
                          >
                            {window.location.hostname}:4000/{link.shortCode}
                          </a>
                          <ExternalLink size={14} className="text-slate-500" />
                        </div>
                        <p className="text-slate-500 text-sm truncate max-w-md">
                          {link.originalUrl}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => copyToClipboard(link.shortCode, link.id)}
                          className={`p-2.5 rounded-xl transition-all duration-200 ${
                            copiedId === link.id 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                          }`}
                          title="Copy to clipboard"
                        >
                          {copiedId === link.id ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoadingMore && (
                  <div className="p-6 text-center text-slate-400 flex justify-center items-center">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Loading more links...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

