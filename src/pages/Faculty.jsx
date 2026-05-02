import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { Mail, Phone, Book, MapPin, Clock, Award } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { DB_SCHEMA } from '../data/db_schema';
import { motion } from 'framer-motion';
import { CardSkeleton } from '../components/Skeleton';

const Faculty = () => {
  const { lang } = useLocale();
  const { facultyMembers: adminFaculty, departments, loading } = useAdmin();

  const facultyMembers = (adminFaculty && adminFaculty.length > 0)
    ? adminFaculty
    : DB_SCHEMA.facultyMembers;

  const resolveName = (name) => {
    if (!name) return '---';
    if (typeof name === 'string') return name;
    return name[lang] || name.ar || name.en || '---';
  };

  const resolveDept = (member) => {
    if (member.department) return member.department;
    const dept = (departments || DB_SCHEMA.departments).find(d => d.id === member.departmentId);
    return dept ? (dept.name?.[lang] || dept.name?.ar || member.departmentId) : (member.departmentId || '---');
  };

  const deans = facultyMembers.filter(m => m.role === 'العميد');
  const heads = facultyMembers.filter(m => m.role === 'رئيس قسم');
  const doctors = facultyMembers.filter(m => m.role === 'دكتور');

  const MemberCard = ({ member, size = 'medium' }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel" 
      style={{ 
        padding: size === 'large' ? '3rem' : '2.5rem', 
        textAlign: 'center',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)',
        maxWidth: size === 'large' ? '700px' : 'none',
        margin: size === 'large' ? '0 auto' : '0',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--bg-color-secondary)'
      }}
    >
      <div style={{ 
        width: size === 'large' ? '160px' : '120px', 
        height: size === 'large' ? '160px' : '120px', 
        backgroundColor: 'var(--primary-color)', 
        borderRadius: '50%', 
        margin: '0 auto 2rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#ffffff', 
        fontSize: size === 'large' ? '3.5rem' : '2.5rem', 
        fontWeight: 'bold',
        boxShadow: 'var(--shadow-md)'
      }}>
        {resolveName(member.name).charAt(0)}
      </div>
      
      <h3 style={{ fontSize: size === 'large' ? '1.8rem' : '1.4rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {resolveName(member.name)}
      </h3>
      
      <div style={{ 
        display: 'inline-block', 
        padding: '0.3rem 1rem', 
        borderRadius: '20px', 
        backgroundColor: 'rgba(241, 196, 15, 0.1)', 
        color: 'var(--accent-color)',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
        {member.role} - {resolveDept(member)}
      </div>

      <p style={{ color: 'var(--primary-light)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        <Award size={16} style={{ verticalAlign: 'middle', marginInlineEnd: '5px' }} />
        {member.specialization}
      </p>

      <div style={{ textAlign: 'start', fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <Book size={18} style={{ flexShrink: 0, color: 'var(--primary-color)', marginTop: '3px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            <strong>{lang === 'ar' ? 'المواد:' : 'Courses:'}</strong>
            {member.courses ? member.courses.split('،').join(',').split(',').map((course, idx) => (
              <span key={idx} style={{ 
                backgroundColor: 'var(--bg-color)', 
                padding: '2px 10px', 
                borderRadius: '6px', 
                fontSize: '0.8rem',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)'
              }}>
                {course.trim()}
              </span>
            )) : '---'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <MapPin size={18} style={{ flexShrink: 0, color: 'var(--primary-color)' }} />
          <span><strong>{lang === 'ar' ? 'المكتب:' : 'Office:'}</strong> {member.office}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Clock size={18} style={{ flexShrink: 0, color: 'var(--primary-color)' }} />
          <span><strong>{lang === 'ar' ? 'الساعات المكتبية:' : 'Office Hours:'}</strong> {member.officeHours}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Mail size={22} /></button>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Phone size={22} /></button>
      </div>
    </motion.div>
  );

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {lang === 'ar' ? 'الهيئة التدريسية' : 'Faculty Members'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
          {lang === 'ar' ? 'نخبة من الكفاءات العلمية والأكاديمية المتميزة في مجالات تكنولوجيا المعلومات.' : 'A group of distinguished scientific and academic competencies in the fields of information technology.'}
        </p>
      </header>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          {deans.length > 0 && (
            <section style={{ marginBottom: '6rem' }}>
              <h2 style={{ textAlign: 'center', color: 'var(--primary-light)', marginBottom: '2.5rem', fontSize: '2rem' }}>
                {lang === 'ar' ? 'عمادة الكلية' : 'Deanery'}
              </h2>
              {deans.map(dean => <MemberCard key={dean.id} member={dean} size="large" />)}
            </section>
          )}

          {heads.length > 0 && (
            <section style={{ marginBottom: '6rem' }}>
              <h2 style={{ textAlign: 'center', color: 'var(--primary-light)', marginBottom: '2.5rem', fontSize: '2rem' }}>
                {lang === 'ar' ? 'رؤساء الأقسام' : 'Heads of Departments'}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                {heads.map(head => <MemberCard key={head.id} member={head} />)}
              </div>
            </section>
          )}

          {doctors.length > 0 && (
            <section>
              <h2 style={{ textAlign: 'center', color: 'var(--primary-light)', marginBottom: '2.5rem', fontSize: '2rem' }}>
                {lang === 'ar' ? 'أعضاء الهيئة التدريسية' : 'Faculty Members'}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {doctors.map(doctor => <MemberCard key={doctor.id} member={doctor} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Faculty;

