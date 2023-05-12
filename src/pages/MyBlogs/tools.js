import Table from '@editorjs/table';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Header from '@editorjs/header';

export const EDITOR_JS_TOOLS = {
  // embed: Embed,
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  // marker: Marker,
  list: List,
  // warning: Warning,
  // code: Code,
  // linkTool: LinkTool,
  image: {
    class: Image,
    config: {
      endpoints: {
        byFile: `${process.env.REACT_APP_BASEURL}editor-upload`, // Your backend file uploader endpoint
        byUrl: `${process.env.REACT_APP_BASEURL}fetchUrl`, // Your endpoint that provides uploading by Url
      },
    },
  },
  // raw: Raw,
  header: Header,
  // quote: Quote,
  // checklist: CheckList,
  // delimiter: Delimiter,
  // inlineCode: InlineCode,
  // simpleImage: SimpleImage
};
