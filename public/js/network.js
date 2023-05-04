const url = './network/getnetwork';

// create an array with nodes




$('#subm').on('click', () => {
    $('#progress').css('display', 'block');
    $('#subm').prop('disabled', true);
    setTimeout(() => {
        $('#subm').prop('disabled', false);
        $('#subm').color('#000000')
    }, 7000)
    console.log('clicked')
    const datas = {
        name: $('#name').val()
    };

    axios.post(url, datas)
        .then(response => {
            $('#mynetwork').html('')
            $('#progress').css('display', 'none');
            console.log(response.data);
            let peoples = response.data.nodes
            let relations = response.data.edges

            var nodes = new vis.DataSet(peoples);
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
                height: '100%',
                width: '100%',
                edges: {
                    smooth: {
                        forceDirection: "none"
                    }
                },
                nodes: {
                    shape: 'circle'
                },
                physics: {
                    forceAtlas2Based: {
                        springLength: 100,
                        springConstant: 0.01
                    },
                    minVelocity: 0.75,
                    solver: "forceAtlas2Based",
                    timestep: 0.34
                },
                interaction: {
                    hover: true
                }
            }

            // initialize your network!
            var network = new vis.Network(container, data, options);
            network.startSimulation();
        })
        .catch(error => {
            console.error(error);
        });
})
