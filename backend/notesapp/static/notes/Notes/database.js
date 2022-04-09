GET_URL="/notes/api/v1/allnotes"

// Example POST method implementation:
async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function deleteData(url = '', data = {}, responseType='text') {
    // Default options are marked with *
    const response = await fetch(url + '?' + new URLSearchParams(data), {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
    });
    if (responseType === 'text')
        return response.text(); // parses JSON response into native JavaScript objects
    else if (responseType === 'json')
        return response.json();
}

async function postData(url = '', data = {}, responseType='text') {
    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");


    // Default options are marked with *
    const response = await fetch(url, {
        crossDomain:true,
        method: 'POST',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    });
    if (responseType === 'text')
        return response.text(); // parses JSON response into native JavaScript objects
    else if (responseType === 'json')
        return response.json();
}

// Function that retrieves all the notes of the current user from the database
function getNotes() {
    getData(GET_URL)
        .then(data => {
            pinnedNotes = []
            otherNotes = []
            data.forEach((note) => {
                if (note.isPinned) {
                    pinnedNotes.push(note)
                } else {
                    otherNotes.push(note)
                }
            })
            console.log(data);
            noteViewUpdater()// JSON data parsed by `data.json()` call
        });
    // const Note = Parse.Object.extend("Notes")
    // const query = new Parse.Query(Note);
    // query.equalTo("username", Parse.User.current().get("username"));
    // query.descending("createdAt")
    // query.find().then((notes) => {
    //     pinnedNotes = []
    //     otherNotes = []
    //     notes.forEach(element => {
    //         const isPinned = element.get("isPinned")
    //         if (isPinned)
    //             pinnedNotes.push(element)
    //         else
    //             otherNotes.push(element)
    //     });
    //     noteViewUpdater()
    // }, (error) => {
    //     showSnackbar(error.message)
    // });
}


//
function saveNote(note) {
    let newNote = {
        title: note.title,
        note: note.body,
        isPinned: note.isPinned
    }
    postData('/notes/api/v1/addnote', newNote, 'json').then((data) => {
        // Successful
        let dimitri = data
        console.log(dimitri)
        let noteToInsert = {
            id: data.id,
            title: note.title,
            note: note.body,
            isPinned: note.pinned
        }
        if (note.pinned) {
            pinnedNotes = [noteToInsert].concat(pinnedNotes)
        } else {
            otherNotes = [noteToInsert].concat(otherNotes)
        }
        noteViewUpdater()
    })
    // const Note = Parse.Object.extend("Notes");
    // const noteObject = new Note();
    // noteObject.set("note", note.body);
    // noteObject.set("title", note.title);
    // noteObject.set("username", Parse.User.current().get("username"));
    // noteObject.set("isPinned", note.pinned);
    // noteObject.save().then((object) => {
    //     // Successful
    //     if (note.pinned) {
    //         pinnedNotes = [object].concat(pinnedNotes)
    //     } else {
    //         otherNotes = [object].concat(otherNotes)
    //     }
    //     noteViewUpdater()
    // }, (error) => {
    //     // If error encountered
    //     // Showing a snackbar to the user saying that the item was not added
    // });
}


function updateNote(noteObject, note) {
    const isPinned = noteObject.isPinned
    if (isPinned && !note.pinned) {
        let noteToUpdate = {
            title: note.title,
            note: note.body,
            isPinned: note.pinned,
            id: noteObject.id
        }
        postData('/notes/api/v1/updatenote', noteToUpdate).then((data) => {
            console.log(data.text())
            const index = pinnedNotes.indexOf(noteObject);
            pinnedNotes.splice(index, 1);
            noteToUpdate.isPinned = note.pinned
            otherNotes = [noteToUpdate].concat(otherNotes)
            noteViewUpdater()
        })
        // const Note = Parse.Object.extend("Notes");
        // const newNoteObject = new Note();
        // newNoteObject.set("note", note.body);
        // newNoteObject.set("title", note.title);
        // newNoteObject.set("username", Parse.User.current().get("username"));
        // newNoteObject.set("isPinned", note.pinned);
        // newNoteObject.save().then((object) => {
        //     noteObject.destroy().then(() => {
        //         const index = pinnedNotes.indexOf(noteObject);
        //         pinnedNotes.splice(index, 1);
        //         otherNotes = [object].concat(otherNotes)
        //         noteViewUpdater()
        //     }, (error) => {
        //
        //     })
        // }, (error) => {
        //     // If error encountered
        //     // Showing a snackbar to the user saying that the item was not added
        // });

    } else if (!isPinned && note.pinned) {
        let noteToUpdate = {
            title: note.title,
            note: note.body,
            isPinned: note.pinned,
            id: noteObject.id
        }
        postData('/notes/api/v1/updatenote', noteToUpdate).then((data) => {
            console.log(data.text())
            const index = otherNotes.indexOf(noteObject);
            otherNotes.splice(index, 1);
            noteToUpdate.isPinned = note.pinned
            pinnedNotes = [noteToUpdate].concat(pinnedNotes)
            noteViewUpdater()
            noteViewUpdater()
        })
        // const Note = Parse.Object.extend("Notes");
        // const newNoteObject = new Note();
        // newNoteObject.set("note", note.body);
        // newNoteObject.set("title", note.title);
        // newNoteObject.set("username", Parse.User.current().get("username"));
        // newNoteObject.set("isPinned", note.pinned);
        // newNoteObject.save().then((object) => {
        //     noteObject.destroy().then(() => {
        //         const index = otherNotes.indexOf(noteObject);
        //         otherNotes.splice(index, 1);
        //         pinnedNotes = [object].concat(pinnedNotes)
        //         noteViewUpdater()
        //     }, (error) => {
        //
        //     })
        // }, (error) => {
        //     // If error encountered
        //     // Showing a snackbar to the user saying that the item was not added
        // });
    } else {

        let noteToUpdate = {
            title: note.title,
            note: note.body,
            isPinned: note.pinned,
            id: noteObject.id
        }
        postData('/notes/api/v1/updatenote', noteToUpdate).then((data) => {
            if (noteToUpdate.isPinned) {
                const index = pinnedNotes.indexOf(noteObject);
                pinnedNotes[index] = noteToUpdate;
                pinnedNotes[index].username = noteObject.username
            } else {
                const index = otherNotes.indexOf(noteObject);
                otherNotes[index] = noteToUpdate;
                otherNotes[index].username = noteObject.username
            }
            console.log(data.text())
            noteViewUpdater()
        })

        // noteObject.set("note", note.body);
        // noteObject.set("title", note.title);
        // noteObject.set("isPinned", note.pinned);
        // noteObject.save().then((object) => {
        //     noteViewUpdater()
        // }, (error) => {
        //     // Handle error
        // })
    }
}

function deleteNotes(note, index) {
    let data = {
        id: note.id
    }
    deleteData('/notes/api/v1/deletenote', data).then((data) => {
        console.log(data)
        if (note.isPinned) {
            pinnedNotes[index] = undefined
            $("#" + index + "-pinned").remove()
            if ($("#pinned-notes-1").children().length == 0 && $("#pinned-notes-2").children().length == 0 && $("#other-notes-1").children().length == 0 && $("#other-notes-2").children().length == 0) {
                $("#pinned-label").text("Notes you add appear here").css('visibility', 'visible').addClass('default-text');
            } else if ($("#pinned-notes-1").children().length == 0 && $("#pinned-notes-2").children().length == 0)
                $("#pinned-label").css('visibility', 'hidden')
            if ($("#other-notes-1").children().length == 0 && $("#other-notes-2").children().length == 0)
                $("#other-label").css('visibility', 'hidden')
            else
                $("#other-label").removeAttr("style")
        } else {
            otherNotes[index] = undefined
                $("#" + index + "-other").remove()
                if ($("#pinned-notes-1").children().length == 0 && $("#pinned-notes-2").children().length == 0 && $("#other-notes-1").children().length == 0 && $("#other-notes-2").children().length == 0) {
                    $("#pinned-label").text("Notes you add appear here").css('visibility', 'visible').addClass('default-text');
                } else if ($("#pinned-notes-1").children().length == 0 && $("#pinned-notes-2").children().length == 0)
                    $("#pinned-label").css('visibility', 'hidden')
                if ($("#other-notes-1").children().length == 0 && $("#other-notes-2").children().length == 0)
                    $("#other-label").css('visibility', 'hidden')
                else
                    $("#other-label").removeAttr("style")
        }
    })
}