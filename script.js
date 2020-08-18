const min_date = new Date(2020, 8 - 1, 10, 23, 59);
const max_date = new Date(2021, 2, 1, 00, 00);

// function get_visible_notes() {
//     var content = document.getElementById("content");
//     var notes = content.getElementsByClassName("note");

//     var visible_notes = new Array();

//     for (let i = 0; i < notes.length; i++) {
//         const element = notes[i];
//         if (element.style.display != "none") {
//             visible_notes.push(element);
//         }

//     }

//     return visible_notes;
// }


function remove_highlight() {
    var b = document.getElementsByTagName('mark');

    while (b.length) {
        var parent = b[0].parentNode;
        while (b[0].firstChild) {
            parent.insertBefore(b[0].firstChild, b[0]);
        }
        parent.removeChild(b[0]);
    }
}

function highlight(text) {
    
    var notes = document.getElementsByClassName("note");
    for (let index = 0; index < notes.length; index++) {
        const element = notes[index];

        for (let j = 0; j < element.childElementCount; j++) {
            const child = element.children[j];

            // https://regex101.com/r/XGtwS6/2
            // var new_inner = child.innerHTML.replace(new RegExp("(?<!(<|\/))"+text+"(?!(>|\/))", "gi"), (match) => "<mark>" + match + "</mark>");
            
            // https://regex101.com/r/I30C47/2
            var new_inner = child.innerHTML.replace(new RegExp("(?<=>[^<\/>]*?)"+text+"(?=[^<\/>]*?(<|>))", "gi"), (match) => "<mark>" + match + "</mark>");

            // var new_inner = child.innerHTML.split(new RegExp("<a(.*?)>", "gi"));
            // console.log(new_inner);
            child.innerHTML = new_inner;

        }

        
    }


}

function search_function() {

    var input, filter;

    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();

    notes = get_notes_within_dates();

    for (let index = 0; index < notes.length; index++) {
        const a = notes[index];
        var txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {


            a.style.display = "block";

            for (let j = 0; j < a.childElementCount; j++) {
                
                const child = a.children[j];

                if (child.className === "subnote"){
                    
                     var subtxtValue = child.textContent || child.innerText;
                     if (subtxtValue.toUpperCase().indexOf(filter) > -1) {         
                         child.style.display = "block";
                     }
                     else{
                        child.style.display = "none";
                     }

                }
                
            }


        } else {
            a.style.display = "none";
        }

    }

    remove_highlight();
    
    if (input.value.length > 0)
        highlight(input.value);


}


function print_content() {
    var divContents = document.getElementById("content").innerHTML;
    var a = window.open('', '', 'height=800, width=400');

    a.document.write('<html>');
    a.document.write('<body >');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
}


function reset_calendar() {
    document.getElementById("start").value = "2020-08-10";
    document.getElementById("end").value = "2021-02-01";

    all_date_handler();
    search_function();
}


function current_month() {
    // var curr = new Date();
    // var first = curr.getDate() - (curr.getDate()); // First day is the day of the month - the day of the week
    // var last = new Date(first); // last day is the first day + 6


    var firstday = new Date();
    var lastday = new Date();

    firstday.setDate(1);
    lastday.setMonth(lastday.getMonth() + 1);
    lastday.setDate(0);

    if (firstday < min_date) {
        firstday = new Date(min_date);
    }

    if (lastday > max_date) {
        lastday = new Date(max_date);
    }

    document.getElementById("start").valueAsDate = firstday;
    document.getElementById("end").valueAsDate = lastday;

    all_date_handler();
    search_function();
}

function current_week() {
    var curr = new Date;
    var first = curr.getDate() - (curr.getDay() - 1); // First day is the day of the month - the day of the week
    var last = first + 4; // last day is the first day + 6


    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(last));


    document.getElementById("start").valueAsDate = firstday;
    document.getElementById("end").valueAsDate = lastday;

    all_date_handler();
    search_function();

}

function current_day() {

    document.getElementById("start").valueAsDate = new Date();
    document.getElementById("end").valueAsDate = new Date();

    all_date_handler();
    search_function();
}

function get_notes_within_dates() {
    notes = get_notes();

    notes = start_date_handler(document.getElementById("start").value, notes);
    return end_date_handler(document.getElementById("end").value, notes);

}

function all_date_handler(reset = true) {


    notes = display_all_notes(true);

    start_date_handler(document.getElementById("start").value, notes);
    end_date_handler(document.getElementById("end").value, notes);

}

function start_date_handler(calendar_date, notes) {

    var select_dates = new Date(calendar_date);

    var out = new Array();


    for (var i = 0; i < notes.length; i++) {
        var parts = notes[i].id.split('_');
        var note_date = new Date(parts[0], parts[1] - 1, parts[2], 23, 59);

        if (note_date < select_dates) {
            notes[i].style.display = "none";
        }
        else {
            out.push(notes[i]);
        }
    }

    return out;

}

function end_date_handler(calendar_date, notes) {

    var select_dates = new Date(calendar_date);

    var out = new Array();

    for (var i = 0; i < notes.length; i++) {
        var parts = notes[i].id.split('_');
        var note_date = new Date(parts[0], parts[1] - 1, parts[2], 00, 00);

        if (note_date > select_dates) {
            notes[i].style.display = "none";
        }
        else {
            out.push(notes[i]);
        }
    }
    return out;

}

function get_notes() {
    return document.getElementsByClassName("note");
}

function display_all_notes(return_notes) {
    var notes = get_notes();
    for (var i = 0; i < notes.length; i++) {
        notes[i].style.display = "block";
    }

    if (return_notes)
        return notes
}