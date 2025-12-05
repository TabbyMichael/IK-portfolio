import Hero from '../../core/components/Hero';
import FeaturedSkills from '../components/FeaturedSkills';
import FeaturedProjects from '../components/FeaturedProjects';
import FeaturedTestimonials from '../components/FeaturedTestimonials';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      <Hero />
      <FeaturedSkills />
      <FeaturedProjects />
      <FeaturedTestimonials />
      <Newsletter />
    </div>
  );
}