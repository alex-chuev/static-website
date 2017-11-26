import { InitAnswers } from './answers/init';
import { generate } from '../generate/generate';

export function init(answers: InitAnswers) {
  generate(answers, {dir: '', src: answers.srcFolder});
}
