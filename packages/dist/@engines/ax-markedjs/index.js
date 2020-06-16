import marked from 'marked';
import axMarkedjs from './lib/ax-markedjs';

axMarkedjs.dependencies = (ax) => {
  ax.extension.markedjs.marked = marked
}

export default axMarkedjs
