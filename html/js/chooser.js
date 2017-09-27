function clickLvl1(e) {
    $('[data-mtgclass-lvl="1"]').removeClass('active');
    $(e.target).addClass('active');
    var pos = 1 + e.target.attributes.href.value.indexOf('#');
    var choice = e.target.attributes.href.value.substring(pos);
    $('#lvl2').html('');
    $('#lvl3').html('');
    $('#lvl4').html('');
    var choices = {};
    choices.Wisdom = {
        question:'In a world of magic, you would:',
        buttons: [
            {hash:'specialize',label:'Specialize in...'},
            {hash:'magic',label:'Focus on Magic'},
            {hash:'faith',label:'Focus on Faith'}
        ]
    };
    choices.Courage = {
        question:'In a war, you\'d be a part of the:',
        buttons: [
            {hash:'army',label:'Army'},
            {hash:'rebellion',label:'Rebellion'},
            {hash:'work',label:'Work Force'}
        ]
    };
    choices.Power = {
        question:'In a battle of Vikings versus Ninjas, you would choose to be:',
        buttons: [
            {hash:'viking',label:'A Viking'},
            {hash:'ninja',label:'A Ninja'},
            {hash:'hire',label:'For Hire'}
        ]
    };
    var view = choices[choice];
    view.lvl = 2;
    $('#lvl2').html(Mustache.render($('#questiontpl').html(), view));
}
function clickLvl2(e) {
    $('[data-mtgclass-lvl="2"]').removeClass('active');
    $(e.target).addClass('active');
    var pos = 1 + e.target.attributes.href.value.indexOf('#');
    var choice = e.target.attributes.href.value.substring(pos);
    $('#lvl2').html(Mustache.render($('#questiontpl').html(), view));
    $('#lvl3').html('');
    $('#lvl4').html('');
    var choices ={};
    choices.specialize = {
        question:'',
        buttons: [
            {hash:'',label:''},
            {hash:'',label:''},
            {hash:'',label:''}
        ]
    };
    choices.magic = {
        question:'',
        buttons: [
            {hash:'',label:''},
            {hash:'',label:''},
            {hash:'',label:''}
        ]
    };
    choices.faith = {
        question:'',
        buttons: [
            {hash:'',label:''},
            {hash:'',label:''},
            {hash:'',label:''}
        ]
    };
    choices.army = {
        question:'',
        buttons: [
            {hash:'',label:''},
            {hash:'',label:''},
            {hash:'',label:''}
        ]
    };
    choices.rebellion = {
        question:'',
        buttons: [
            {hash:'',label:''},
            {hash:'',label:''},
            {hash:'',label:''}
        ]
    };
    choices.work = {
        question:'',
        buttons: [
            {hash:'',label:''},
            {hash:'',label:''},
            {hash:'',label:''}
        ]
    };
    choices.viking = {
        question:'',
        buttons: [
            {hash:'',label:''},
            {hash:'',label:''},
            {hash:'',label:''}
        ]
    };
    choices.ninjas = {
        question:'Vikings attack you, you attack them:',
        buttons: [
            {hash:'samurai',label:'In an honorable showdown'},
            {hash:'ninja',label:'By sneaking upon them'},
            {hash:'archer',label:'From a distance'}
        ]
    };
    choices.hire = {
        question:'',
        buttons: [
            {hash:'',label:''},
            {hash:'',label:''},
            {hash:'',label:''}
        ]
    };
    var view = choices[choice];
    view.lvl = 3;
    $('#lvl3').html(Mustache.render($('#questiontpl').html(), view));
}
function clickLvl3(e) {
    $('[data-mtgclass-lvl="3"]').removeClass('active');
    $(e.target).addClass('active');
    view.lvl = 2;
    $('#lvl2').html(Mustache.render($('#questiontpl').html(), view));
}

// handlers
$('[data-mtgclass-lvl="1"]').on('click', clickLvl1);
$('[data-mtgclass-lvl="2"]').on('click', clickLvl2);
$('[data-mtgclass-lvl="3"]').on('click', clickLvl3);