import dynamic from 'next/dynamic';
import Preloader from '@/components/public/preloader';
import Nav from '@/components/public/nav';
import Hero from '@/components/public/hero';
import Marquee from '@/components/public/marquee';
import WorkSection from '@/components/public/work-section';
import { getFaqs, getProjects, getServices, getSettings, getStats, getTechStack, getTestimonials } from '@/lib/data';

const Services = dynamic(() => import('@/components/public/services'));
const Orbit = dynamic(() => import('@/components/public/orbit'));
const Timeline = dynamic(() => import('@/components/public/timeline'));
const About = dynamic(() => import('@/components/public/about'));
const Testimonials = dynamic(() => import('@/components/public/testimonials'));
const Faq = dynamic(() => import('@/components/public/faq'));
const Contact = dynamic(() => import('@/components/public/contact'));
const Footer = dynamic(() => import('@/components/public/footer'));

export const metadata = { title: 'BuildWithMe — Webs • Apps • And More' };

export default async function HomePage() {
  const [settings, projects, services, tech, stats, testimonials, faqs] = await Promise.all([
    getSettings(), getProjects(), getServices(), getTechStack(), getStats(), getTestimonials(), getFaqs(),
  ]);

  return (
    <main>
      <Preloader />
      <Nav available={settings.available_for_work} />
      <Hero settings={settings} />
      <Marquee />
      <WorkSection projects={projects} />
      <Services services={services} />
      <Orbit items={tech} />
      <Timeline />
      <About settings={settings} stats={stats} />
      <Testimonials items={testimonials} />
      <Faq items={faqs} />
      <Contact settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
