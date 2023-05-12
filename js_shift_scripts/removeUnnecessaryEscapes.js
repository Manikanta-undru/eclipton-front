// removeUnnecessaryEscapes.js
module.exports = function(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);
  
    const regexLiteralPattern = /\/([^/\\]*(?:\\.[^/\\]*)*)\/([gimuy]*)/g;
  
    root.find(j.Literal).forEach((path) => {
      if (typeof path.value.value === 'string' && path.value.regex) {
        const regexValue = path.value.value;
        const flags = path.value.regex.flags;
        const updatedRegexValue = regexValue.replace(/\\/g, '');
  
        path.replace(
          j.literal({
            value: updatedRegexValue,
            regex: {
              pattern: updatedRegexValue,
              flags: flags,
            },
          })
        );
      }
    });
  
    return root.toSource();
  };
  