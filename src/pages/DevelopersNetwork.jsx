import React, { useState, useEffect } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Code, GitBranch, Star, GitFork, Award, Zap, Users, ExternalLink, Flame, RefreshCw } from 'lucide-react';

const DevelopersNetwork = () => {
  const { lang, t } = useLocale();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const leaderboardData = [
    { id: 1, name: 'Ahmad Salem', points: 2850, solved: 42, avatar: 'AS', rank: 1, badge: 'Grandmaster' },
    { id: 2, name: 'Sara Khalid', points: 2420, solved: 38, avatar: 'SK', rank: 2, badge: 'Expert' },
    { id: 3, name: 'Omar Yassin', points: 2100, solved: 35, avatar: 'OY', rank: 3, badge: 'Pro' },
    { id: 4, name: 'Lina Murad', points: 1850, solved: 29, avatar: 'LM', rank: 4, badge: 'Competitor' },
    { id: 5, name: 'Zaid Fawzi', points: 1720, solved: 26, avatar: 'ZF', rank: 5, badge: 'Competitor' },
  ];

  const competitions = [
    { 
      id: 1, 
      title: lang === 'ar' ? 'تحدي خوارزميات الربيع' : 'Spring Algorithms Challenge', 
      difficulty: 'Hard', 
      reward: '500 Pts + Badge', 
      participants: 124, 
      date: 'Ends in 2 days' 
    },
    { 
      id: 2, 
      title: lang === 'ar' ? 'ماراثون تحليل البيانات' : 'Data Analytics Marathon', 
      difficulty: 'Medium', 
      reward: '300 Pts', 
      participants: 89, 
      date: 'Starts Tomorrow' 
    }
  ];

  useEffect(() => {
    if (activeTab === 'honor_roll') {
      setLoadingRepos(true);
      fetch('https://api.github.com/users/mohammadzaraa41-ai/repos?sort=updated&per_page=6')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRepos(data);
          }
          setLoadingRepos(false);
        })
        .catch(() => setLoadingRepos(false));
    }
  }, [activeTab]);

  const tabs = [
    { id: 'leaderboard', label: t('dev_sections.leaderboard'), icon: <Trophy size={18} /> },
    { id: 'competitions', label: t('dev_sections.competitions'), icon: <Code size={18} /> },
    { id: 'honor_roll', label: t('dev_sections.honor_roll'), icon: <GitBranch size={18} /> }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', minHeight: '80vh' }}>
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t('nav.dev_network')}</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          {lang === 'ar' 
            ? 'مجتمع المبدعين في كلية تكنولوجيا المعلومات - نافستك نحو القمة تبدأ من هنا' 
            : 'The IT Faculty Creators Hub - Your journey to the top starts here.'}
        </p>
      </motion.div>

      {/* Tabs Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem', 
        marginBottom: '3rem',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'btn-primary' : 'btn-outline'}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Leaderboard Section */}
          {activeTab === 'leaderboard' && (
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Award className="accent-color" />
                  {t('dev_sections.leaderboard')}
                </h2>
                <span className="glass-panel-light" style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                  Weekly Reset
                </span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '1.5rem' }}>{t('dev_sections.rank')}</th>
                      <th style={{ padding: '1.5rem' }}>User</th>
                      <th style={{ padding: '1.5rem' }}>{t('dev_sections.solved')}</th>
                      <th style={{ padding: '1.5rem' }}>{t('dev_sections.points')}</th>
                      <th style={{ padding: '1.5rem' }}>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((user) => (
                      <motion.tr 
                        whileHover={{ background: 'rgba(255,255,255,0.05)' }}
                        key={user.id} 
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.3s' }}
                      >
                        <td style={{ padding: '1.5rem', fontWeight: 'bold' }}>
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-color)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {user.avatar}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem' }}>{user.solved}</td>
                        <td style={{ padding: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{user.points}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                            {user.badge}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Competitions Section */}
          {activeTab === 'competitions' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {competitions.map((comp) => (
                <motion.div 
                  whileHover={{ y: -10 }}
                  key={comp.id} 
                  className="glass-panel" 
                  style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'var(--primary-color)' }}>
                      <Zap size={24} className="accent-color" />
                    </div>
                    <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 'bold' }}>{comp.date}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{comp.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Challenge your peers and climb the ranks.</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Users size={16} /> {comp.participants} Joined
                    </span>
                    <span style={{ color: comp.difficulty === 'Hard' ? '#ef4444' : '#10b981' }}>{comp.difficulty}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem' }}>
                    <strong>{t('dev_sections.prizes')}:</strong> {comp.reward}
                  </div>
                  <button className="btn-primary" style={{ width: '100%' }}>{lang === 'ar' ? 'شارك الآن' : 'Participate Now'}</button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Honor Roll (GitHub) Section */}
          {activeTab === 'honor_roll' && (
            <div>
              {loadingRepos ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <RefreshCw size={40} className="accent-color" />
                  </motion.div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  {repos.map((repo) => (
                    <motion.div 
                      key={repo.id}
                      whileHover={{ scale: 1.02 }}
                      className="glass-panel"
                      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--accent-color)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <GitBranch size={20} />
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={14} /> {repo.stargazers_count}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><GitFork size={14} /> {repo.forks_count}</span>
                        </div>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-color)' }}>{repo.name}</h3>
                      <p style={{ fontSize: '0.85rem', height: '3rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {repo.description || (lang === 'ar' ? 'لا يوجد وصف متاح' : 'No description available')}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                          {repo.language || 'Code'}
                        </span>
                        <a 
                          href={repo.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                        >
                          {t('dev_sections.view_repo')} <ExternalLink size={14} />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ textAlign: 'center', marginTop: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <Flame className="accent-color" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {lang === 'ar' ? 'انضم إلى شبكة المطورين وكن جزءاً من النخبة' : 'Join the Developer Network and be part of the elite.'}
        </p>
      </div>
    </div>
  );
};

export default DevelopersNetwork;
