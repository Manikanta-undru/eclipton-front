module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.CallExpression, {
      callee: {
        property: {
          name: 'map',
        },
      },
    })
    .forEach((path) => {
      const mapFunction = path.value.arguments[0];
      if (mapFunction.params.length === 0 || mapFunction.params[0].type !== 'Identifier') {
        return;
      }
      const paramName = mapFunction.params[1] ? mapFunction.params[1].name : 'i';

      j(mapFunction)
        .findJSXElements()
        .at(0)
        .forEach((jsxElementPath) => {
          const existingKeyProp = jsxElementPath.value.openingElement.attributes.find(
            (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'key'
          );

          if (!existingKeyProp) {
            jsxElementPath.value.openingElement.attributes.push(
              j.jsxAttribute(
                j.jsxIdentifier('key'),
                j.jsxExpressionContainer(j.identifier(paramName))
              )
            );
          }
        });
    });

  return root.toSource();
};
