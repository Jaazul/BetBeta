$(document).ready(function() {
    let competitions = [];

    $('#login-button').click(function() {
        const username = $('#username').val();
        const password = $('#password').val();
        // Simple client-side check (replace with real authentication)
        if(username === 'user' && password === 'password') {
            $('#auth-section').hide();
            $('#competition-section').show();
        } else {
            alert('Invalid login');
        }
    });

    $('#create-competition-button').click(function() {
        const category = $('#category').val();
        const file = $('#file-upload').prop('files')[0];
        const stake = $('#stake').val();

        if (!file || !stake || isNaN(stake) || stake <= 0) {
            alert('Please provide valid inputs');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const competition = {
                category,
                fileContent: e.target.result,
                stake: parseFloat(stake),
                id: competitions.length + 1,
                votes: 0,
                startTime: null,
                endTime: null,
                contestants: []
            };
            competitions.push(competition);
            displayCompetitions();
        };
        reader.readAsDataURL(file);
    });

    function displayCompetitions() {
        $('#competitions').empty();
        competitions.forEach(comp => {
            const isVotingOpen = comp.startTime && new Date() < comp.endTime;
            $('#competitions').append(`
                <div class="competition">
                    <p>Category: ${comp.category}</p>
                    <p>Stake: $${comp.stake}</p>
                    <audio controls>
                        <source src="${comp.fileContent}" type="audio/mp3">
                        Your browser does not support the audio element.
                    </audio>
                    <p>Votes: ${comp.votes}</p>
                    ${isVotingOpen ? `<button onclick="vote(${comp.id})">Vote</button>` : ''}
                    <button onclick="joinCompetition(${comp.id})">Join Competition</button>
                </div>
            `);
        });
    }

    window.joinCompetition = function(id) {
        const competition = competitions.find(comp => comp.id === id);
        if (competition) {
            const file = prompt('Upload your file (URL for simplicity):');
            if (file) {
                competition.contestants.push(file);
                if (competition.contestants.length === 2) {
                    competition.startTime = new Date();
                    competition.endTime = new Date(competition.startTime.getTime() + 72 * 60 * 60 * 1000);
                }
                displayCompetitions();
            }
        } else {
            alert('Competition not found');
        }
    };

    window.vote = function(id) {
        const competition = competitions.find(comp => comp.id === id);
        if (competition) {
            competition.votes += 1;
            displayCompetitions();
        } else {
            alert('Competition not found');
        }
    };
});
