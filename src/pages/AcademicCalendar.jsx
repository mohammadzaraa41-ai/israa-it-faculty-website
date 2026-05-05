import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Bell, Info } from 'lucide-react';
import { useLocale } from '../contexts/LocalizationContext';

const AcademicCalendar = () => {
  const { lang } = useLocale();

  const calendarData = lang === 'ar' ? [
    { date: '05 / 10 / 2025', day: 'الأحد', event: 'بدء العام الجامعي 2025-2026 ، وبدء دوام أعضاء الهيئة التدريسية' },
    { date: '05 / 10 / 2025', day: 'الأحد', event: 'بدء فترة امتحانات المستوى للطلبة الجدد المقبولين في الفصل الدراسي الأول من العام الجامعي 2025-2026' },
    { date: '11 / 10 / 2025', day: 'السبت', event: 'بدء التدريس لطلبة الدراسات العليا' },
    { date: '12 / 10 / 2025', day: 'الأحد', event: 'بدء التدريس لطلبة البكالوريوس' },
    { date: '11 - 19 / 10 / 2025', day: 'السبت - الأحد', event: 'فترة السحب والإضافة' },
    { date: '19 / 10 / 2025', day: 'الأحد', event: 'نهاية فترة تأجيل الدراسة للفصل الدراسي الأول من العام الجامعي 2025-2026' },
    { date: '20 / 10 / 2025', day: 'الإثنين', event: 'بدء الغرامة المالية على الطلبة القدامى والمتأخرين عن التسجيل للفصل الدراسي الأول من العام الجامعي 2025-2026' },
    { date: '20 / 10 / 2025', day: 'الإثنين', event: 'بدء فترة الانسحاب من مادة أو أكثر بخسارة مالية' },
    { date: '23 / 10 / 2025', day: 'الخميس', event: 'آخر موعد لتقديم امتحانات غير المكتمل للفصل الدراسي الثاني والصيفي من العام الجامعي 2024-2025' },
    { date: '13 - 18 / 12 / 2025', day: 'السبت - الخميس', event: 'فترة عقد الاختبار النصف فصلي' },
    { date: '25 / 12 / 2025', day: 'الخميس', event: 'عيد الميلاد المجيد' },
    { date: '01 / 01 / 2026', day: 'الخميس', event: 'رأس السنة الميلادية' },
    { date: '03 / 01 / 2026', day: 'السبت', event: 'بدء التسجيل المبكر للفصل الدراسي الثاني من العام الجامعي 2025-2026' },
    { date: '15 / 01 / 2026', day: 'الخميس', event: 'نهاية فترة الانسحاب من مادة أو أكثر بخسارة مالية أو الانسحاب من جميع مواد الفصل الدراسي الأول من العام الجامعي 2025-2026' },
    { date: '15 / 01 / 2026', day: 'الخميس', event: 'آخر موعد لتسليم قوائم الحرمان من الكليات لدائرة القبول والتسجيل' },
    { date: '15 / 01 / 2026', day: 'الخميس', event: 'آخر موعد لمناقشة رسائل الماجستير' },
    { date: '22 / 01 / 2026', day: 'الخميس', event: 'نهاية فترة امتحانات المستوى للطلبة الجدد المقبولين في الفصل الدراسي الأول من العام الجامعي 2025-2026' },
    { date: '22 / 01 / 2026', day: 'الخميس', event: 'آخر يوم للتدريس في الفصل الدراسي الأول من العام الجامعي 2025-2026' },
    { date: '24/01 - 05/02/2026', day: 'السبت - الخميس', event: 'فترة الامتحانات النهائية' },
    { date: '08 / 02 / 2026', day: 'الأحد', event: 'بدء إجازة أعضاء الهيئة التدريسية' },
    { date: '09 / 02 / 2026', day: 'الإثنين', event: 'آخر موعد لتسليم نتائج الامتحانات لدائرة القبول والتسجيل' },
    { date: '10 / 02 / 2026', day: 'الثلاثاء', event: 'إعلان نتائج الفصل الدراسي الأول من العام الجامعي 2025-2026' },
    { date: '12 / 02 / 2026', day: 'الخميس', event: 'آخر موعد لمراجعة الطالب المتوقع تخرجه على الفصل الدراسي الأول من العام الجامعي 2025-2026 علامته النهائية في الامتحان النهائي لمواد الفصل' },
    { date: '19 / 02 / 2026', day: 'الخميس', event: 'إقرار منح الدرجات العلمية من مجلس العمداء بناء على تنسيب مجالس الكليات' },
    { date: '23 / 02 / 2026', day: 'الإثنين', event: 'آخر موعد لمراجعة الطالب المسجل على الفصل الدراسي الأول من العام الجامعي 2025-2026 علامته النهائية في الامتحان النهائي لمواد الفصل' },
  ] : [
    { date: '05 / 10 / 2025', day: 'Sun', event: 'Start of 2025-2026 Academic Year & Faculty Duty' },
    { date: '05 / 10 / 2025', day: 'Sun', event: 'Start of Proficiency Exams for New Students' },
    { date: '11 / 10 / 2025', day: 'Sat', event: 'Start of Classes for Graduate Students' },
    { date: '12 / 10 / 2025', day: 'Sun', event: 'Start of Classes for Undergraduate Students' },
    { date: '11 - 19 / 10 / 2025', day: 'Sat - Sun', event: 'Drop & Add Period' },
    { date: '19 / 10 / 2025', day: 'Sun', event: 'Deadline for Study Postponement (First Semester)' },
    { date: '20 / 10 / 2025', day: 'Mon', event: 'Late Registration Fine Period Starts' },
    { date: '20 / 10 / 2025', day: 'Mon', event: 'Withdrawal Period with Financial Loss Starts' },
    { date: '23 / 10 / 2025', day: 'Thu', event: 'Incomplete Exam Deadline for Previous Semesters' },
    { date: '13 - 18 / 12 / 2025', day: 'Sat - Thu', event: 'Midterm Exams Period' },
    { date: '25 / 12 / 2025', day: 'Thu', event: 'Christmas Holiday' },
    { date: '01 / 01 / 2026', day: 'Thu', event: 'New Year Holiday' },
    { date: '03 / 01 / 2026', day: 'Sat', event: 'Early Registration for Second Semester Starts' },
    { date: '15 / 01 / 2026', day: 'Thu', event: 'Final Withdrawal Deadline for First Semester' },
    { date: '15 / 01 / 2026', day: 'Thu', event: 'Deprivation Lists Submission Deadline' },
    { date: '15 / 01 / 2026', day: 'Thu', event: 'Master Thesis Defense Deadline' },
    { date: '22 / 01 / 2026', day: 'Thu', event: 'Proficiency Exams End for New Students' },
    { date: '22 / 01 / 2026', day: 'Thu', event: 'Last Day of Classes (First Semester)' },
    { date: '24/01 - 05/02/2026', day: 'Sat - Thu', event: 'Final Exams Period' },
    { date: '08 / 02 / 2026', day: 'Sun', event: 'Faculty Holiday Starts' },
    { date: '09 / 02 / 2026', day: 'Mon', event: 'Final Grades Submission Deadline' },
    { date: '10 / 02 / 2026', day: 'Tue', event: 'Announcement of First Semester Results' },
    { date: '12 / 02 / 2026', day: 'Thu', event: 'Grade Review Deadline for Expected Graduates' },
    { date: '19 / 02 / 2026', day: 'Thu', event: 'Degrees Approval by Deans Council' },
    { date: '23 / 02 / 2026', day: 'Mon', event: 'General Grade Review Deadline for Registered Students' },
  ];

  return (
    <div className="academic-calendar-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          style={{ display: 'inline-block', padding: '1rem', background: 'var(--primary-color)', borderRadius: '20px', color: 'white', marginBottom: '1.5rem' }}
        >
          <Calendar size={40} />
        </motion.div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary-color)', marginBottom: '1rem' }}>
          {lang === 'ar' ? 'التقويم الجامعي' : 'Academic Calendar'}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.5rem 1.5rem', background: 'var(--accent-color)', color: 'white', borderRadius: '50px', fontWeight: 'bold' }}>
            2025 - 2026
          </span>
          <span style={{ padding: '0.5rem 1.5rem', background: 'rgba(0,33,71,0.1)', color: 'var(--primary-color)', borderRadius: '50px', fontWeight: 'bold' }}>
            {lang === 'ar' ? 'الفصل الدراسي الأول' : 'First Semester'}
          </span>
        </div>
      </header>

      <style>{`
        .academic-calendar-container { padding: 2rem; maxWidth: 1200px; margin: 0 auto; }
        .calendar-table-wrapper { border-radius: 24px; box-shadow: var(--shadow-lg); background: var(--bg-color-secondary); border: 1px solid var(--border-color); overflow: hidden; }
        
        /* Mobile Card Styles */
        .mobile-calendar-view { display: none; flex-direction: column; gap: 1rem; }
        .calendar-card { 
          background: var(--surface-color); 
          padding: 1.5rem; 
          border-radius: 16px; 
          border: 1px solid var(--border-color);
          border-right: 4px solid var(--accent-color);
          box-shadow: var(--shadow-sm);
        }
        .card-date { color: var(--accent-color); font-weight: 800; font-size: 0.9rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .card-event { color: var(--text-primary); line-height: 1.6; font-size: 1rem; }

        @media (max-width: 768px) {
          .calendar-table-wrapper { display: none; }
          .mobile-calendar-view { display: flex; }
          .academic-calendar-container { padding: 1rem; }
          header h1 { font-size: 2rem !important; }
        }
      `}</style>

      <div className="calendar-table-wrapper">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: lang === 'ar' ? 'right' : 'left' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
              <th style={{ padding: '1.5rem', fontWeight: '800' }}>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th style={{ padding: '1.5rem', fontWeight: '800' }}>{lang === 'ar' ? 'اليوم' : 'Day'}</th>
              <th style={{ padding: '1.5rem', fontWeight: '800' }}>{lang === 'ar' ? 'البيـــــــــــــــــــــــــــــــــان' : 'Description'}</th>
            </tr>
          </thead>
          <tbody>
            {calendarData.map((item, index) => (
              <tr 
                key={index}
                style={{ 
                  borderBottom: '1px solid var(--border-color)',
                  background: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'
                }}
              >
                <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} style={{ color: 'var(--accent-color)' }} />
                    {item.date}
                  </div>
                </td>
                <td style={{ padding: '1.2rem', fontWeight: '600' }}>{item.day}</td>
                <td style={{ padding: '1.2rem', lineHeight: '1.6', fontSize: '1.05rem' }}>{item.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-calendar-view">
        {calendarData.map((item, index) => (
          <div 
            key={index}
            className="calendar-card"
          >
            <div className="card-date">
              <Calendar size={14} />
              {item.day} | {item.date}
            </div>
            <div className="card-event">{item.event}</div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(128,0,0,0.05)', borderRadius: '20px', border: '1px dashed var(--accent-color)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <Info size={24} style={{ color: 'var(--accent-color)', flexShrink: 0, marginTop: '0.2rem' }} />
          <div>
            <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {lang === 'ar' ? 'ملاحظات هامة' : 'Important Notes'}
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {lang === 'ar' 
                ? 'يرجى الالتزام بالمواعيد والتواريخ المذكورة أعلاه. أي تغييرات طارئة سيتم الإعلان عنها عبر القنوات الرسمية للجامعة.' 
                : 'Please adhere to the dates and times mentioned above. Any emergency changes will be announced through official university channels.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AcademicCalendar;
