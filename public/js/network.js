const url = 'http://localhost:4000/account/network/getnetwork';

// create an array with nodes




$('#subm').on('click', () => {
    console.log('clicked')
    const datas = {
        name: $('#name').val()
    };

    axios.post(url, datas)
        .then(response => {
            console.log(response.data);
            window.alert('success');
            let peoples = response.data.nodes
            let relations = response.data.edges


            var nodes = new vis.DataSet(peoples);

            // create an array with edges
            var edges = new vis.DataSet(relations);

            // create a network
            var container = document.getElementById('mynetwork');

            // provide the data in the vis format
            var data = {
                nodes: nodes,
                edges: edges
            };

            const options = {
                autoResize: true,
                edges: {
                    smooth: {
                        forceDirection: "none"
                    }
                },
                physics: {
                    forceAtlas2Based: {
                        springLength: 80,
                        springConstant: 0.27
                    },
                    minVelocity: 0.75,
                    solver: "forceAtlas2Based",
                    timestep: 0.34
                },
                layout: {
                    randomSeed: undefined
                },
                interaction: {
                    hover: true
                }
            }

            // initialize your network!
            new vis.Network(container, data, options);

        })
        .catch(error => {
            console.error(error);
        });
})
