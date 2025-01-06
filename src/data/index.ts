import { projects } from './projects';
import { moreProjects } from './moreProjects';
import { moreProjects2 } from './moreProjects2';

export const allProjects = [...projects, ...moreProjects, ...moreProjects2];

export * from './projects';
export * from './moreProjects';
export * from './moreProjects2';