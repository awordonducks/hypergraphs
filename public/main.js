//Plot graphs


//This programme can receive data in the following format:
/*
[NodeObject, NodeObject, NodeObject]
Where NodeObject is:
	{Value: value,
	InfluencedBy: [
		[{node: N1, weight: W1}, {node: N2}],
		[{node: N1, weughtL W1}],
		[{node: N2, weight: W2}, {node:N3, weigth: W3}]
	]}

---OR---

{
	V:[{node: N1, value: V1}, {node: N2, value: V2}, {node: N3, value: V2}]
	E:[{edge: [{node: N1, weight: W1}, {node: N2, weight: W3}, {node: N2, weight: W3}]}, {edge: [WN1, WN2]}, {edge: [WN1, WN3]}]
}
//WN1 = {node: N1,
		 weight: W1}

i.e. this follows the Hypergraph definition of h = (V, E) where V is a set of vertices and E is a set of (weighted)edges. I think.
*/

//EVENTUALLY I'll write something to parse csv into JSON, then upload it to a DB and pull that data in.
//For now, though, we will generate data based on custon equations.
/*
Equation format:
	y = (1X1, 5X2, 2X3) + (2X1, 1X3) + (3X2, 4X3)
		where y = some vertex

	Y1 = (aX1, bX2, cX3) + (dX1, eX2) + (fX1, gX3) 
		for Y1, X1, X2, X3 in V
		where V = list of vertices > [3]
*/



//Ajax request data
var getData = function(){

	var graphURL = '/sampleSet.json'
	$.ajax({
		url: graphURL,
		type:'GET',
		dataType: 'json',
		error: function(err){
			console.log("Bugger");
			console.log(err)
		},
		success: function(data){
			console.log("Woohoo!");
			console.log(data);

			parseData(data);

		}
	})
}

var parseData = function(data){
	console.log('- - - - - - - - - - - -')
	console.log(data)
}


var nodeList = [];
var edgeList = []
var hyperEdgeList = []
var cy;

var initialiseGraph = function(n){
	cy = cytoscape({
	  container: document.getElementById('cy'), 
	  style: [],
	  zoom: 1,
	  pan: { x: 0, y: 0 },
	  minZoom: 1e-50,
	  maxZoom: 1e50,
	  zoomingEnabled: true,
	  motionBlur: false,
	  ready: function(){ 
	  	console.log('ready');
	  	populateNodes(n)
	  }
	});
}


var populateNodes = function(n){
	//Initial Nodes

	
	for ( var i = 0; i < n; i++){
		obj = {
			group: "nodes",
			data: {
				id: "Node" + i.toString(),
				weight: 1
			},
			css: {'content': 'data(id)'}
			
		}
		nodeList.push(obj)
		console.log('ADDING AN ELEMENT: TEST TEST')
		console.log(obj)

	}
	console.log('NODELIST:')
	console.log(nodeList)
	cy.add(nodeList);

	cy.elements().each(function(i, ele){
		console.log('ELEMENT TEST TEST')
		console.log(ele)
	})

	cy.layout({name: 'cola'})

}

//HYPEREDGE
var createHyperEdge = function(nodeSelections){
	/* --INFO--
	HyperEdgeList is an ARRAY of ALL Hyperedges
	HyperEdge is a COLLECTION of nodes, edges
	
	Hyperedge perhaps could be custom object, but for now it's collection for ease of interaction with cytoscape.js
	[0] = Central Node
	[1] = Target Node
	[2 - n] = Source Nodes
	*/
	console.log('NODE SELECTION <<<<<<<<<');
	console.log(nodeSelections)
	var hyperEdgeIndex = hyperEdgeList.length	// <<< Get current hyperedge index

	var hyperEdge = cy.collection();			// <<< Empty collection to add NODES and EDGES into
	console.log('HYPEREDGE: ')
	console.log(hyperEdge)

	var centralNode = cy.collection([
		{
			group: 'nodes', 
			data: {
				id: 'hyperEdgeCentral' + hyperEdgeIndex,
				weight: Math.random(0.1,2)
				
			},
			css: {
					'width' : '1px',
					'height' : '1px',
					'color' : 'black'
				}
		}
	]) 																					//Hard Coded for now, must replace later
	console.log('CENTRAL NODE:')
	console.log(centralNode)
	var tNode = cy.$('#' + nodeSelections[1].data.id);
	//console.log(tNode.eq(0))
	var TargetNode = cy.collection([tNode.eq(0)]); 										//Hard coded for now, must replace later.
	console.log('TARGET NODE:')
	console.log(TargetNode)

	var sourceNodes = []; 																//SourceNodes will be array, but must be expanded for addition to collecton

	for(var x = 1; x < nodeSelections.length; x +=1){		
		console.log('X = ' + x);		
		console.log('Source = ' );
		console.log(nodeSelections[x].data.id)		
		var source = cy.$('#' + nodeSelections[x].data.id);
		
		sourceNodes.push(source)
	}
	
	
	console.log('SourceNodes:')
	console.log(sourceNodes)

	newHyperEdge = hyperEdge.add(centralNode)
	console.log(1)
	newHyperEdge = newHyperEdge.add(TargetNode)
	console.log(2)
	sourceNodes.forEach(function(ele, i){
		console.log('Iterate');
		console.log(ele)
		console.log(i)
		newHyperEdge = newHyperEdge.add(sourceNodes[i])
	})
	
	console.log(3)
	console.log('NEW HYPEREDGE');
	console.log(newHyperEdge)
	
	console.log(hyperEdgeList)

	console.log('HYPEREDGE NODES SET')


	console.log('================')

	var ele = newHyperEdge

	console.log('...')
	console.log("Element: "+ hyperEdgeIndex + ":");
	console.log(ele)
	console.log("CONTAINS:")

	var centralNode = ele[0]
	console.log('Central: ' + centralNode.data('id'))
	var targetNode = ele[1]
	console.log('Target: ' + targetNode.data('id'))

	var sources = []
	for(var j = 2; j < newHyperEdge.size(); j += 1){
		sources.push(newHyperEdge[j])
	}
	console.log('sources set')
	

	var edges = []
	//HERE WE DEFINE THE CENTRAL TO TARGET
	edges.push({
		group: 'edges',
		data: {
			id: "H" + hyperEdgeIndex + "E" + 0,
			source: centralNode.data('id'),
			target: targetNode.data('id'),
			strength: 1
		},
		css: {
			'width' : '6px',
			'line-color' : 'rgb(255, 0, 0)',
			'line-style' : 'solid',
			'target-arrow-shape' : 'triangle',
			'target-arrow-color' : 'black',
			
		}
	})
	console.log('Target edge set')

	//HERE WE DEFINE SOURCES TO CENTRAL
	sources.forEach(function(src, indX){
		var str = Math.floor(Math.random()*10+1)					//<<<<<< Random. Must change to real val

		console.log(src.data('id'))
		edges.push({
			group: 'edges',
			data: {
				id: "H" + hyperEdgeIndex + "E" + (indX+1),
				source: src.data('id'),
				target: centralNode.data('id'),
				strength: str
			},
			css: {
				'width' : str.toString() + 'px',
				'line-color' : 'rgb(255, 0, 0)',
				'opacity' : '0.2',
				'line-style' : 'solid',
				'source-arrow-shape' : 'tee',
				'source-arrow-color' : 'rgba(255, 0, 0, 1)'
			}
		})
	})

	console.log('EDGES:')
	console.log(edges)

	var completeHyperEdge = cy.collection(edges)
	newHyperEdge = newHyperEdge.add(completeHyperEdge)

	cy.layout({
		
		name: 'cola',
		padding: 20,
		animate: true, // whether to transition the node positions
		animationDuration: 500, // duration of animation in ms if enabled
		//nodeSpacing: function( node ){ return 10; },

		// positioning options
		randomize: false, // use random node positions at beginning of layout
		avoidOverlap: true, // if true, prevents overlap of node bounding boxes
		handleDisconnected: true, // if true, avoids disconnected components from overlapping
		nodeSpacing: function( node ){ return 20; }, // extra spacing around nodes
		flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
		alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }

		// different methods of specifying edge length
		// each can be a constant numerical value or a function like `function( edge ){ return 2; }`
		edgeLength: undefined, // sets edge length directly in simulation
		/*
		function(edge){
			console.log('HELLO')
			console.log(edge);
			var strength = edge.data('weight');

			return 100 * strength;

		}
		*/
		edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
		edgeJaccardLength: undefined, // jaccard edge length in simulation

		// iterations of cola algorithm; uses default values on undefined
		unconstrIter: undefined, // unconstrained initial layout iterations
		userConstIter: undefined, // initial layout iterations with user-specified constraints
		allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

		// infinite layout options
		infinite: true // overrides all other options for a forces-all-the-time mode


		

	})

	console.log(newHyperEdge)
	hyperEdgeList.push(newHyperEdge)


}


//Equation = 5X1*4X2*3X3*2X4 
$('document').ready(function(){

	//getData()				//<<< Call to json file on server.
	var numberOfNodes = 40


	

	$('#userInput').keydown(function(e){

	})

	////KEY BINDINGS.
	$(document).keydown(function(e){
		if(e.which==13){
			var numberOfNodes = $('#userInput').val()
			console.log(numberOfNodes)
			$('#testingInput').css({'opacity' : '0'})
			//$('testingInput').css({'opacity' : '0'})
			initialiseGraph(numberOfNodes);
		}
		//H
		if(e.which == 72){
			var selection = []
			console.log('NODELIST:');
			console.log(nodeList)
			for(var i = 0; i < Math.floor(Math.random() * 5 + 4); i += 1){			//Random number between 2 and 5, replace with real data
				console.log('i = ' + i)
				var rand = Math.floor(Math.random()*nodeList.length)
				console.log('Rand = ' + rand)
				var sel = nodeList[rand]
				console.log('SELECTION');
				console.log(sel)
				selection.push(sel)
			}
			console.log('SELECTIONLIST')
			console.log(selection)
			createHyperEdge(selection);
		}
		//L
		if(e.which==76){
			cy.elements().each(function(i, ele){
				if(ele.isNode()){
					if(ele.locked()){
						console.log("UNLOCKING")
						ele.unlock()
					}
					else{
						console.log("LOCKING")
						ele.lock()
					}
				}
			})
			
		}
		//F
		if(e.which == 70){
			cy.layout({
				name: 'cola',
				padding: 20,
				animate: true, // whether to transition the node positions
	  			animationDuration: 1000, // duration of animation in ms if enabled
	  			randomize: true,
	  			//nodeSpacing: function( node ){ return 100; },
	  			infinite: true
			})
		}
		//T
		if(e.which == 84){
			console.log('TEST STATS')
			cy.elements().each(function(i, ele){
				console.log(ele)
			})
		}

	})
})