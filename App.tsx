
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Clock, 
  Hash, 
  Users, 
  ArrowRight,
  Zap,
  Bot,
  Cpu,
  Globe,
  Activity,
  Mail,
  Loader2,
  Lock,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { SITE_NAME } from './constants';
import { Article, ViewState } from './types';
import { fetchArticles, fetchArticleContent } from './services/articleLoader';
import HeroCanvas from './components/HeroCanvas';
import MarkdownRenderer from './components/MarkdownRenderer';
import AIChat from './components/AIChat';

// Custom X (Twitter) Logo Component
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articleContentLoading, setArticleContentLoading] = useState(false);
  const [fullArticleContent, setFullArticleContent] = useState<string>('');

  // Initial Data Fetch
  useEffect(() => {
    const initData = async () => {
      // Simulate a "System Boot" delay for aesthetic purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fetchedArticles = await fetchArticles();
      setArticles(fetchedArticles);
      setIsLoading(false);
    };
    initData();
  }, []);

  // Sorting articles by date descending
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [articles]);

  const latestArticle = sortedArticles[0];

  const handleNav = (view: ViewState) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const openArticle = async (article: Article) => {
    // Logic for external/premium links
    if (article.externalUrl) {
      window.open(article.externalUrl, '_blank');
      return;
    }

    setSelectedArticleId(article.id);
    setCurrentView('ARTICLE_READ');
    window.scrollTo(0, 0);

    // Fetch full content if needed
    setArticleContentLoading(true);
    const content = await fetchArticleContent(article);
    setFullArticleContent(content);
    setArticleContentLoading(false);
  };

  const openLatest = () => {
    if (latestArticle) openArticle(latestArticle);
  };

  const currentArticle = useMemo(() => 
    articles.find(a => a.id === selectedArticleId), 
  [selectedArticleId, articles]);

  // --- Components defined internally for cohesion given the file structure limits ---

  const NavLink: React.FC<{ view: ViewState; label: string }> = ({ view, label }) => (
    <button
      onClick={() => handleNav(view)}
      className={`px-4 py-2 text-sm font-mono tracking-widest uppercase transition-all duration-300 relative group ${
        currentView === view ? 'text-nexus-cyan' : 'text-gray-400 hover:text-white'
      }`}
    >
      <span className="relative z-10">{label}</span>
      {currentView === view && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-nexus-cyan shadow-[0_0_10px_#00f0ff]"></span>
      )}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-600 transition-all group-hover:w-full"></span>
    </button>
  );

  const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    const isPremium = article.isPremium;
    
    return (
      <div 
        onClick={() => openArticle(article)}
        className={`group relative border bg-nexus-card transition-all duration-300 cursor-pointer overflow-hidden rounded-sm flex flex-col h-full
          ${isPremium 
            ? 'border-amber-500/20 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
            : 'border-white/10 hover:border-nexus-cyan/50 hover:bg-nexus-gray'
          }
        `}
      >
        <div className="aspect-video w-full overflow-hidden relative">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nexus-black via-transparent to-transparent opacity-80" />
          
          {/* Tags */}
          <div className="absolute bottom-4 left-4 flex gap-2">
             {article.tags.map(tag => (
               <span key={tag} className={`text-[10px] px-2 py-1 uppercase font-mono tracking-wider backdrop-blur-sm border 
                  ${isPremium ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-nexus-cyan/20 text-nexus-cyan border-nexus-cyan/20'}
               `}>
                 {tag}
               </span>
             ))}
          </div>

          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute top-4 right-4 bg-amber-500 text-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 font-mono">
              <Lock size={10} /> Substack
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col relative">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-mono">
            <Clock size={12} />
            {article.date}
          </div>
          <h3 className={`text-xl font-bold mb-3 transition-colors font-display leading-tight tracking-wide
            ${isPremium ? 'text-gray-100 group-hover:text-amber-400' : 'text-gray-100 group-hover:text-nexus-cyan'}
          `}>
            {article.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-1 font-tech text-lg">
            {article.summary}
          </p>
          
          <div className={`flex items-center text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300 mt-auto
             ${isPremium ? 'text-amber-500' : 'text-nexus-cyan'}
          `}>
            {isPremium ? (
              <>Premium Access <ExternalLink size={12} className="ml-2" /></>
            ) : (
              <>Access Log <ArrowRight size={12} className="ml-2" /></>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-nexus-black flex flex-col items-center justify-center z-[100]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-nexus-cyan/30 border-t-nexus-cyan rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu size={20} className="text-nexus-cyan animate-pulse" />
        </div>
      </div>
      <div className="mt-8 font-mono text-nexus-cyan text-sm tracking-widest uppercase animate-pulse">
        Initializing Neural Link...
      </div>
      <div className="mt-2 text-xs text-gray-600 font-mono">
        Decrypting Data Stream
      </div>
    </div>
  );

  // --- Views ---

  const HomeView = () => (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <HeroCanvas />
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
        <div className="inline-flex items-center gap-3 px-4 py-1 border-l-2 border-r-2 border-nexus-cyan/30 bg-black/50 text-nexus-cyan text-xs font-mono mb-4 backdrop-blur-sm tracking-[0.2em]">
          <Activity size={12} className="animate-pulse" />
          SYSTEM_STATUS: ONLINE
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white font-display uppercase leading-none drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] select-none">
            EMBODIED AI TIMES
          </h1>
          
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-400 font-mono uppercase tracking-[0.15em] mt-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
             <span>General Purpose Intelligence</span>
             <span className="hidden md:inline text-nexus-cyan/50">//</span>
             <span className="text-nexus-cyan">Will Happen In Robotics</span>
          </h2>
        </div>
        
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-nexus-cyan to-transparent mx-auto my-8 opacity-50"></div>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-tech font-light tracking-wide">
          We decode the black box of physical AI. 
          <br className="hidden md:block"/>
          Translating frontier research into clear, accessible insights.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
          <button 
            onClick={openLatest}
            className="group relative px-8 py-4 bg-nexus-cyan text-nexus-black font-bold tracking-widest uppercase text-sm hover:bg-white transition-colors overflow-hidden font-display skew-x-[-10deg]"
          >
            <span className="relative z-10 flex items-center gap-2 skew-x-[10deg]">
              Initialize Latest <Zap size={16} />
            </span>
          </button>
          
          <button 
            onClick={() => handleNav('LIST')}
            className="px-8 py-4 border border-gray-700 text-gray-300 hover:border-nexus-cyan hover:text-nexus-cyan transition-colors uppercase text-sm tracking-widest font-mono skew-x-[-10deg] hover:bg-nexus-cyan/10"
          >
            <span className="block skew-x-[10deg]">Access Archives</span>
          </button>
        </div>
      </div>
      
      {/* Decorative footer elements for home */}
      <div className="absolute bottom-10 left-0 w-full flex justify-between px-10 text-[10px] text-gray-600 font-mono uppercase">
        <div className="flex gap-8">
          <span className="flex items-center gap-2"><Cpu size={12} className="text-nexus-cyan" /> NEURAL_NET: ACTIVE</span>
          <span className="flex items-center gap-2"><Globe size={12} className="text-nexus-cyan" /> UPLINK: SECURE</span>
        </div>
        <div className="tracking-widest">
           EAI_TIMES // VER_2.0.4
        </div>
      </div>
    </div>
  );

  const ListView = () => (
    <div className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-8">
        <Hash className="text-nexus-cyan" />
        <h2 className="text-4xl font-bold text-white tracking-tight font-display uppercase">Data Archives</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );

  const ArticleReadView = () => {
    if (!currentArticle) return <div className="pt-40 text-center font-mono text-red-500">ERROR: DATA CORRUPTED // 404</div>;

    if (articleContentLoading) {
       return (
         <div className="min-h-screen flex items-center justify-center bg-nexus-black">
            <div className="text-nexus-cyan font-mono animate-pulse flex flex-col items-center gap-4">
              <Loader2 className="animate-spin" size={32} />
              <span>DOWNLOADING CONTENT PACKAGE...</span>
            </div>
         </div>
       )
    }

    return (
      <div className="min-h-screen bg-nexus-black relative">
        {/* Hero Image Header */}
        <div className="h-[60vh] w-full relative">
          <img src={currentArticle.imageUrl} className="w-full h-full object-cover filter brightness-50 grayscale hover:grayscale-0 transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-nexus-black to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-20 max-w-5xl">
            <div className="flex gap-4 mb-6">
              {currentArticle.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30 text-xs font-bold uppercase tracking-wider font-mono">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-none font-display uppercase">
              {currentArticle.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-400 font-mono text-xs border-l-2 border-nexus-cyan pl-4">
              <span className="text-white uppercase tracking-wider">{currentArticle.author}</span>
              <span>//</span>
              <span>{currentArticle.date}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-nexus-cyan/80 mb-12 font-tech font-light border-b border-white/10 pb-10 leading-relaxed tracking-wide">
              {currentArticle.summary}
            </p>
            {/* Use the loaded full content */}
            <MarkdownRenderer content={fullArticleContent || "# Content Load Failed"} />
          </div>
          
          <div className="mt-20 border-t border-white/10 pt-10 flex justify-between items-center">
            <button 
              onClick={() => handleNav('LIST')}
              className="flex items-center gap-2 text-gray-500 hover:text-nexus-cyan transition-colors font-mono uppercase text-xs tracking-widest"
            >
              <ArrowRight className="rotate-180" size={16} /> Return to Grid
            </button>
            <div className="font-mono text-xs text-gray-600 uppercase">EAI TIMES // END OF FILE</div>
          </div>
        </div>
        
        {/* AI Assistant Hook - Now uses the dynamically loaded content */}
        <AIChat articleContent={`Title: ${currentArticle.title}\n\n${fullArticleContent}`} />
      </div>
    );
  };

  const AboutView = () => (
    <div className="pt-32 px-6 max-w-4xl mx-auto min-h-screen pb-20">
      <div className="border-l-4 border-nexus-cyan bg-white/5 p-8 md:p-12 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Users size={150} className="text-nexus-cyan" />
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-white mb-10 font-display uppercase tracking-tighter">About Us</h2>
        <div className="space-y-8 text-lg md:text-xl text-gray-300 leading-relaxed font-tech font-light">
          <p>
            <strong className="text-white font-mono">EMBODIED AI TIMES</strong> is built on a singular axiom: 
            <span className="text-nexus-cyan"> Intelligence requires a body.</span>
          </p>
          <p>
             We exist to close the widening gap between high-dimensional academic papers and public understanding.
          </p>
          <p>
            We decode the raw output of the robotics revolution—Sim-to-Real transfer, haptic feedback, and humanoid control—into 
            <strong className="text-white"> clear, high-fidelity signals</strong>. No fluff. No hype. Just the engineering reality of tomorrow.
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-xl font-display text-white mb-6 uppercase tracking-wider">Communication Channels</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <a 
              href="https://x.com/EraAi95973" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-black/40 border border-white/10 p-4 rounded hover:border-nexus-cyan/50 hover:bg-nexus-cyan/5 transition-all group"
            >
              <div className="p-2 bg-white text-black rounded-full group-hover:bg-nexus-cyan transition-colors">
                 <XLogo className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-mono uppercase">Follow on X</span>
                <span className="text-white font-tech tracking-wide">EAI TIMES</span>
              </div>
            </a>

            <a 
              href="https://substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-black/40 border border-white/10 p-4 rounded hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
            >
              <div className="p-2 bg-white text-black rounded-full group-hover:bg-amber-500 transition-colors">
                 <BookOpen size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-mono uppercase">Newsletter</span>
                <span className="text-white font-tech tracking-wide">Subscribe on Substack</span>
              </div>
            </a>

            <a 
              href="mailto:eraofembodiedai@gmail.com" 
              className="flex items-center gap-4 bg-black/40 border border-white/10 p-4 rounded hover:border-nexus-cyan/50 hover:bg-nexus-cyan/5 transition-all group"
            >
              <div className="p-2 bg-white text-black rounded-full group-hover:bg-nexus-cyan transition-colors">
                 <Mail size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-mono uppercase">Direct Contact</span>
                <span className="text-white font-tech tracking-wide">eraofembodiedai@gmail.com</span>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs text-gray-500 border-t border-white/10 pt-8 uppercase tracking-widest">
          <div>
            <span className="block text-nexus-cyan mb-2">Established</span>
            2025.06
          </div>
          <div>
            <span className="block text-nexus-cyan mb-2">Sector</span>
            Embodied AI
          </div>
          <div>
            <span className="block text-nexus-cyan mb-2">Format</span>
            Deep Dive
          </div>
          <div>
            <span className="block text-nexus-cyan mb-2">Protocol</span>
            Open Access
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-nexus-black text-gray-200 font-sans selection:bg-nexus-cyan selection:text-black">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-nexus-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div 
            onClick={() => handleNav('HOME')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Bot size={24} className="text-nexus-cyan group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold tracking-widest font-display text-white group-hover:text-nexus-cyan transition-colors uppercase">
              EAI TIMES
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            <NavLink view="HOME" label="Home" />
            <NavLink view="LIST" label="Archives" />
            <NavLink view="ABOUT" label="About Us" />
            {/* Special Latest Button */}
            <button 
              onClick={openLatest}
              className="flex items-center gap-2 text-xs font-mono uppercase bg-nexus-cyan/10 hover:bg-nexus-cyan text-nexus-cyan hover:text-black px-4 py-2 transition-all border border-nexus-cyan/30 hover:border-nexus-cyan"
            >
              <Zap size={14} /> Latest Intel
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-nexus-cyan transition-colors">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-nexus-black pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-2xl font-bold">
            <button onClick={() => handleNav('HOME')} className="text-left border-b border-gray-800 pb-4 font-display uppercase">Home</button>
            <button onClick={openLatest} className="text-left border-b border-gray-800 pb-4 text-nexus-cyan font-display uppercase">Latest Intel</button>
            <button onClick={() => handleNav('LIST')} className="text-left border-b border-gray-800 pb-4 font-display uppercase">Archives</button>
            <button onClick={() => handleNav('ABOUT')} className="text-left border-b border-gray-800 pb-4 font-display uppercase">About Us</button>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="min-h-screen">
        {currentView === 'HOME' && <HomeView />}
        {currentView === 'LIST' && <ListView />}
        {currentView === 'ARTICLE_READ' && <ArticleReadView />}
        {currentView === 'ABOUT' && <AboutView />}
      </main>

      {/* Footer */}
      {currentView !== 'HOME' && (
        <footer className="border-t border-white/5 py-12 bg-nexus-black text-center text-gray-600 text-xs font-mono uppercase tracking-widest">
          <p>© 2025 EMBODIED AI TIMES. INTELLIGENCE REQUIRES A BODY.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
