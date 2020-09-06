import JSONEditor from 'jsoneditor';
import axAppkitJsoneditor from './lib/ax-appkit-jsoneditor';

axAppkitJsoneditor.dependencies = (ax) => {
  ax.extension.jsoneditor.JSONEditor = JSONEditor
};

export default axAppkitJsoneditor;
