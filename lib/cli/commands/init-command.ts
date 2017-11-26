import { InitAnswers } from './answers/init';
import { generate } from '../generate/generate';

export function initCommand(answers: InitAnswers) {
  generate(answers, {dir: '', src: answers.srcFolder});
}
