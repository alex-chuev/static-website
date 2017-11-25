import { generate } from '../utils/generate';
import { CreateAnswers } from './answers/create';

export function create(dir: string, answers: CreateAnswers) {
  generate(answers, {dir, src: ''});
}
