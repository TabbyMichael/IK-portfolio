import Hero from '../components/Hero';
import FeaturedSkills from '../components/home/FeaturedSkills';
import FeaturedProjects from '../components/home/FeaturedProjects';
import GithubActivity from '../components/home/GithubActivity';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      <Hero />
      <FeaturedSkills />
      <FeaturedProjects />
      <GithubActivity />
    </div>
  );
}