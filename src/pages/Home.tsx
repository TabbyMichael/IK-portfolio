import Hero from '../components/Hero';
import FeaturedSkills from '../components/home/FeaturedSkills';
import FeaturedProjects from '../components/home/FeaturedProjects';
import FeaturedTestimonials from '../components/home/FeaturedTestimonials';
import Newsletter from '../components/home/Newsletter';

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