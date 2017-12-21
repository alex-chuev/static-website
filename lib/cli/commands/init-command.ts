import { InitAnswers } from './answers/init';
import { generate } from '../utils/generate';

export function initCommand(answers: InitAnswers) {
  generate(answers, {dir: '', src: answers.srcFolder});
}
