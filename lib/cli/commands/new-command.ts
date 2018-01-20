import { generate } from '../utils/generate';
import { CreateAnswers } from '../interfaces/create-answers';

export function newCommand(dir: string, answers: CreateAnswers) {
  generate(answers, {dir, src: 'src'});
}
