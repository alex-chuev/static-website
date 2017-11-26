import { generate } from '../generate/generate';
import { CreateAnswers } from './answers/create';

export function newCommand(dir: string, answers: CreateAnswers) {
  generate(answers, {dir, src: ''});
}
