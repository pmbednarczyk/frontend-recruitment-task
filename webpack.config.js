const	path	=	require("path");
module.exports	=	{
    entry:	"./js/index.jsx",
    output:	{
        path:	path.resolve("js"),
        filename:	"out.js"
    },
    watch:	true,
    module:	{
        loaders:	[
            {
                test:	/\.jsx$/,		exclude:	/node_modules/,
                loader:	'babel-loader',
                query:	{	presets:	['es2015', 'stage-2', 'react']	}
            }
        ]
    }
};