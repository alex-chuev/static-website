import { InitAnswers } from './answers/init';
import { generate } from '../utils/generate';

export function init(answers: InitAnswers) {
  generate(answers, {dir: '', src: answers.srcFolder});
}
