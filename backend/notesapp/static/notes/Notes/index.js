    //// Initializing parse
    //Parse.initialize(config.APP_ID, config.JAVASCRIPT_KEY); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    //Parse.serverURL = config.SERVER_URL

// Checking if user is logged in
// if (!Parse.User.current()) {
//     window.location.href = config.LOGIN_PATH;
// }

// Array to hold all pinned notes
let pinnedNotes = [];
// Array to hold the indexes of pinned notes which are selected
let pinnedSelectedNotesIndices = [];
// Array to hold all other notes
let otherNotes = [];
// Array to hold the indexes of other notes which are selected
let otherSelectedNotesIndices = [];
// Boolean which indicates the state of the note dialog
let noteDialogOpen = false
let deleteDialogOpen = false
let logOutDialogOpen = false
// Object that holds details to navigate to the clicked note. It's value is undefined when the user creates a new note and is assigned a value when the user clicks an existing note
let noteIdentifier = {
    pinned: undefined,
    id: undefined
}

let viewportWidth;


let leftPosFixed;
let leftPosVariable;
let difference;

function setVars() {
    leftPosFixed = $(".header-notes-fixed").get(0).getBoundingClientRect().left
    leftPosVariable = $(".header-notes").get(0).getBoundingClientRect().left
    difference = leftPosVariable - leftPosFixed
    viewportWidth = window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
}

$(window).on("resize", function () {
    setVars()
    scrollFunction()
})

window.onload = setVars()

window.onscroll = function () {
    scrollFunction()
};

/***************** One UI Animation, noice *****************/

// 0.125 * window.innerWidth is 80px in 640px viewport height (Moto G4) and looks good hence 0.125 pr 12.5% of viewport height
function scrollFunction() {
    let bodyTop = $("body").get(0).getBoundingClientRect().top
    let headerTop = $(".header-notes").get(0).getBoundingClientRect().top
    // Length of the "Notes" text from its top to the top of the page and subtracting 12.5% of the viewport's height and subtracting 10 which is the bottom padding of the section 
    let lengthFromTop = Math.abs(bodyTop - headerTop) - (0.125 * window.innerHeight) - 10/* bottom padding of header-section*/
    let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    if (scroll > lengthFromTop && scroll < lengthFromTop + (0.125 * window.innerHeight)) {
        let diff = scroll - lengthFromTop
        $(".header-notes").css("font-size", "" + 15/* initial font size i.e. 15vw */ - (((15 - 5.5555556/* final/desired font size i.e. 5.5555556vw */) / (0.125 * window.innerHeight)) * (scroll - lengthFromTop)) + "vw")
        $(".header-notes").css("left", "" + leftPosVariable - ((difference / (0.125 * window.innerHeight)) * diff) + "px")
        $(".header-section-fixed").removeClass("show")
        $(".header-notes").css("visibility", "visible")
    } else if (scroll < lengthFromTop) {
        $(".header-notes").removeAttr('style')
        $(".header-section-fixed").removeClass("show")
        $(".header-notes").css("visibility", "visible")
    } else if (scroll > lengthFromTop + (0.125 * window.innerHeight)) {
        $(".header-notes").css("font-size", "" + 5.55556 + "vw")
        $(".header-notes").css("visibility", "hidden")
        sleep(0).then(() => {
            $(".header-section-fixed").addClass("show")
        })
    }
}

function noteViewUpdater() {
    $("#pinned-notes-1").html('')
    $("#pinned-notes-2").html('')
    $("#other-notes-1").html('')
    $("#other-notes-2").html('')
    for (let i = 0; i < pinnedNotes.length; i++) {
        if (pinnedNotes[i] === undefined) {
            continue
        }
        appendNote(pinnedNotes[i].title, pinnedNotes[i].note, pinnedNotes[i].isPinned, i)
    }
    for (let i = 0; i < otherNotes.length; i++) {
        if (otherNotes[i] === undefined) {
            continue
        }
        appendNote(otherNotes[i].title, otherNotes[i].note, otherNotes[i].isPinned, i)
    }
    setLabelVisibility()
}

// Function that adds a "note card" to the div
function appendNote(title, body, isPinned, i) {
    let divToAppend
    const noteCardHTML = '<p class="note-title-notes noselect">' + title + '</p><p class="note-body-notes noselect">' + body + '</p>'
    const noteCardClass = "card-display-note"
    if (isPinned)
        divToAppend = $("<div />", { html: noteCardHTML }).addClass(noteCardClass).attr('id', "" + i + "-pinned")
    else
        divToAppend = $("<div />", { html: noteCardHTML }).addClass(noteCardClass).attr('id', "" + i + "-other")
    if (isPinned) {
        if ((i + 1) % 2 === 1) {
            divToAppend.appendTo("#pinned-notes-1")
        } else {
            divToAppend.appendTo("#pinned-notes-2")
        }
    } else {
        if ((i + 1) % 2 === 1) {
            divToAppend.appendTo("#other-notes-1")
        } else {
            divToAppend.appendTo("#other-notes-2")
        }
    }
}

function setLabelVisibility() {
    const numberOfChildrenOfPinnedNotes1Div = $("#pinned-notes-1").children().length;
    const numberOfChildrenOfPinnedNotes2Div = $("#pinned-notes-2").children().length;
    const numberOfChildrenOfOtherNotes1Div = $("#other-notes-1").children().length;
    const numberOfChildrenOfOtherNotes2Div = $("#other-notes-2").children().length;
    const notesExist = !(numberOfChildrenOfOtherNotes1Div == 0 && numberOfChildrenOfOtherNotes2Div == 0 && numberOfChildrenOfPinnedNotes1Div == 0 && numberOfChildrenOfPinnedNotes2Div == 0)
    const otherNotesExists = !(numberOfChildrenOfOtherNotes1Div == 0 && numberOfChildrenOfOtherNotes2Div == 0)
    const pinnedNotesExist = !(numberOfChildrenOfPinnedNotes1Div == 0 && numberOfChildrenOfPinnedNotes2Div == 0)
    if (!notesExist) {
        $("#pinned-label").text("Notes you add appear here").css('visibility', 'visible').addClass('default-text');
        $("#other-label").css('visibility', 'hidden')
        return
    } else {
        $("#pinned-label").text("Pinned").removeClass('default-text')
    }
    if (!pinnedNotesExist)
        $("#pinned-label").css('visibility', 'hidden')
    else
        $("#pinned-label").removeAttr("style")
    if (!otherNotesExists)
        $("#other-label").css('visibility', 'hidden')
    else
        $("#other-label").removeAttr("style")
}

function clearSelection() {
    // Iterating through each index and removing the "selected" class 
    pinnedSelectedNotesIndices.forEach((elem) => {
        $("#" + elem + "-pinned").removeClass("selected")

    });
    // Iterating through each index and removing the "selected" class
    otherSelectedNotesIndices.forEach((elem) => {
        $("#" + elem + "-other").removeClass("selected")
    });
    // Clearing indices of pinned notes
    pinnedSelectedNotesIndices = []
    // Clearing indices of other notes
    otherSelectedNotesIndices = []
}

// Function that waits for [ms] milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function that opens dialog with the title and note specified in the parameter
function openDialog(title, note) {
    $("#note-body-notes").text(note)
    $("#note-title-notes").val(title)
    if (note) {
        noteBodyDivPlaceholder.addClass("hide")
    } else {
        if (noteBodyDivPlaceholder.hasClass("hide")) {
            noteBodyDivPlaceholder.removeClass("hide")
        }
        if (!noteBodyDivPlaceholder.hasClass("show")) {
            noteBodyDivPlaceholder.addClass("show")
        }
    }
    const unpinSVG = '<svg viewBox="0 0 256 256" height="5vw">\n' +
        '    <path fill="#000"\n' +
        '          d="M96.89,19.32c3.39,6 6.36,11 9.14,16.12 1.23,2.27 2.87,4.75 2.92,7.17 0.27,14.48 0.14,29 0.14,45.07 -3.36,-3.31 -5.58,-6.11 -8.37,-8.14C91.29,72.62 87.19,63.7 89.19,51.99c0.74,-4.25 -0.91,-7.77 -3.3,-11.51A53.41,53.41 0,0 1,77.19 9.42c0.19,-5.48 4,-9.36 9.5,-9.37q49.5,-0.09 99,0c5.64,0 9.42,4.07 9.48,10 0.11,11.63 -3.58,22.11 -9.61,32a16,16 0,0 0,-2.41 7.76c-0.19,21.5 -0.08,43 -0.15,64.5a7.19,7.19 0,0 0,3.14 6.57c21.66,17 33.44,39 33,66.87a16.34,16.34 0,0 1,-2.27 7.15c-6.66,-7.88 -16.4,-12.15 -19,-23.78C194.19,154.99 184.35,142.17 170.03,133.35c-4.69,-2.89 -7,-6.46 -6.89,-12.18q0.35,-37 0,-74a22.27,22.27 0,0 1,4.62 -14.25c2.88,-3.88 4.72,-8.53 7.41,-13.58Z"/>\n' +
        '    <path fill="#000"\n' +
        '          d="M10.83,0.06c2.51,1.56 5.29,2.68 7.24,4.62q34.23,34 68.21,68.24 51.21,51.3 102.44,102.56c23.45,23.44 47,46.76 70.46,70.22a13.75,13.75 0,0 1,3.84 6.08c1,4.33 0.05,8.73 -4.48,10.54 -4.33,1.73 -8.49,1.16 -12.26,-2.62q-66.9,-67 -134,-133.89Q58.48,72.17 4.61,18.59c-5.93,-5.91 -6.18,-11.09 -0.55,-15.69C5.65,1.54 8.06,1.17 10.83,0.06Z"/>\n' +
        '    <path fill="#000"\n' +
        '          d="M126.24,197.05L64.59,197.05c-9.2,0 -12.77,-3.37 -12.21,-12.75 1.51,-25.31 12.15,-46.11 31.91,-62 3.26,-2.63 6.16,-4.93 4.81,-9.9l16.88,18.14C89.19,140.68 76.19,155.64 72.98,177.99h13.43c22,0 44,-0.1 66,0.13a12.31,12.31 0,0 1,7.35 3c5.46,4.81 10.48,10.12 16.72,16.27h-30.4v5.89c0,17.16 0.06,34.33 0,51.49 0,8.53 -7.2,13.53 -14.33,10.15 -4.31,-2.05 -5.46,-5.95 -5.46,-10.34v-51.5Z"/>\n' +
        '</svg>'
    const pinSVG = '<svg viewBox="0 0 125.44 198.66" height="5vw">\n' +
        '    <path fill="#000" d="M125.41,139.27c-1.11,-20 -9.1,-36.54 -25.17,-48.77a5.79,5.79 0,0 1,-2.46 -5.31c0.07,-15.82 0,-31.65 0.12,-47.47a12.58,12.58 0,0 1,1.87 -6.17,44.24 44.24,0 0,0 7.13,-23.62c0,-4.88 -2.75,-7.86 -7.55,-7.88q-36.63,-0.11 -73.28,0c-4.86,0 -7.5,3 -7.51,7.85a44.5,44.5 0,0 0,7 23.66A13.28,13.28 0,0 1,27.59 38.08c0.16,15.7 0,31.4 0.14,47.1a6.13,6.13 0,0 1,-2.76 5.52c-15.35,11.88 -23.71,27.58 -24.9,46.95C-0.41,145.08 2.43,147.87 9.89,147.88h45.41v43.06c0,3.21 0.93,6.31 4.13,7.25 2.24,0.66 5.63,0.75 7.2,-0.52a10.65,10.65 0,0 0,3.36 -7.28c0.33,-12.7 0.15,-25.42 0.15,-38.13L70.14,147.88h46C122.41,147.88 125.72,144.76 125.41,139.27ZM109.81,132.88L15.48,132.88c2.45,-13.49 8.74,-24.24 19.92,-31.49 5.4,-3.5 7.39,-7.36 7.25,-13.71 -0.4,-17.82 0,-35.66 -0.27,-53.48 0,-2.88 -1.52,-5.85 -2.79,-8.56 -1.62,-3.43 -3.7,-6.65 -5.95,-10.6L91.59,15.04c-2,3.69 -3.49,7.15 -5.62,10.16a15.19,15.19 0,0 0,-3 9.31q0.18,28.6 0,57.22c0,4.14 2.25,6.3 5.34,8.27 11.51,7.35 18.48,17.87 21.42,31.14 0.1,0.47 0.11,1 0.19,1.74Z"/>\n' +
        '</svg>'
    if (noteIdentifier.pinned === true) {
        $("#fab-pin-note").html(unpinSVG)
    } else {
        $("#fab-pin-note").html(pinSVG)
    }
    if (viewportWidth < 768) {
        // Showing blur background
        $("#add-note-dialog-notes").css("display", "block")
        // Function used to asynchronously show animation/ Showing dialog
        sleep(0).then(() => {
            $("#card-dialog").addClass("show");
            $("#add-note-dialog-notes").addClass("show");
        });
        noteDialogOpen = true
    } else {
        $("#fab-close-note").css("display", "inline-flex")
    }
}

function openConfirmationDialog(title, body) {
    $(".confirmation-dialog-header").text(title)
    $(".confirmation-dialog-body").text(body)
    // Showing blur background
    $("#confirmation-dialog-notes").css("display", "block")
    sleep(0).then(() => {
        $("#confirmation-dialog").addClass("show")
        $("#confirmation-dialog-notes").addClass("show")
    });
}

function closeConfirmationDialog() {
    $("#confirmation-dialog").removeClass("show");
    $("#confirmation-dialog-notes").removeClass("show");
    sleep(500).then(() => {
        $("#confirmation-dialog-notes").removeAttr('style')
    });
}

// Method to close the dialog and clear the inputs in the dialog
function closeDialog() {
    if (viewportWidth < 768) {
        $("#card-dialog").removeClass("show");
        $("#add-note-dialog-notes").removeClass("show");
        sleep(500).then(() => {
            $("#add-note-dialog-notes").removeAttr('style')
        });
        noteDialogOpen = false
    } else {
        $("#fab-close-note").css("display", "none")
    }
    sleep(0.5).then(() => {
        noteBodyDivPlaceholder.removeClass("hide")
        $("#note-body-notes").text("")
        $("#note-title-notes").val("")
    })
    noteIdentifier = {
        pinned: undefined,
        id: undefined
    }
}

function showSnackbar(text) {
    let snackbar = $("#snackbar")
    snackbar.addClass("show")
    snackbar.text(text)
    setTimeout(function () {
        snackbar.removeClass("show")
    }, 3000);
}

function deleteSelectedNotes() {
    pinnedSelectedNotesIndices.forEach((elem) => {
        pinnedNotes[elem].destroy().then((myObject) => {
            pinnedNotes[elem] = undefined
            $("#" + elem + "-pinned").remove()
            if ($("#pinned-notes-1").children().length == 0 && $("#pinned-notes-2").children().length == 0 && $("#other-notes-1").children().length == 0 && $("#other-notes-2").children().length == 0) {
                $("#pinned-label").text("Notes you add appear here").css('visibility', 'visible').addClass('default-text');
            } else if ($("#pinned-notes-1").children().length == 0 && $("#pinned-notes-2").children().length == 0)
                $("#pinned-label").css('visibility', 'hidden')
            if ($("#other-notes-1").children().length == 0 && $("#other-notes-2").children().length == 0)
                $("#other-label").css('visibility', 'hidden')
            else
                $("#other-label").removeAttr("style")
        }, (error) => {
            // The delete failed.
            // error is a Parse.Error with an error code and message.
        });
    })
    otherSelectedNotesIndices.forEach((elem) => {
        otherNotes[elem].destroy().then((myObject) => {
            otherNotes[elem] = undefined
            $("#" + elem + "-other").remove()
            if ($("#pinned-notes-1").children().length == 0 && $("#pinned-notes-2").children().length == 0 && $("#other-notes-1").children().length == 0 && $("#other-notes-2").children().length == 0) {
                $("#pinned-label").text("Notes you add appear here").css('visibility', 'visible').addClass('default-text');
            } else if ($("#pinned-notes-1").children().length == 0 && $("#pinned-notes-2").children().length == 0)
                $("#pinned-label").css('visibility', 'hidden')
            if ($("#other-notes-1").children().length == 0 && $("#other-notes-2").children().length == 0)
                $("#other-label").css('visibility', 'hidden')
            else
                $("#other-label").removeAttr("style")
        }, (error) => {
            // The delete failed.
            // error is a Parse.Error with an error code and message.
        });
    })
}

function createNote(pinned) {
    let noteBody = $("#note-body-notes").text()
    let noteTitle = $("#note-title-notes").val()
    if (noteTitle === "" && noteBody === "") {
        showSnackbar("Note cannot be empty")
        return
    }
    let note = {
        title: noteTitle,
        body: noteBody,
        pinned: pinned
    }
    if (noteIdentifier.id !== undefined) {
        if (noteIdentifier.pinned) {
            updateNote(pinnedNotes[noteIdentifier.id], note)
        }
        else {
            updateNote(otherNotes[noteIdentifier.id], note)
        }
    } else {
        saveNote(note)
    }
    closeDialog()
}

let fabIsOpen = false
let selectMode = false

function closeMenu() {
    $("#fab-select-note").removeClass("show")
    $("#fab-add-note").removeClass("show")
    $("#fab-logout-user").removeClass("show")
    $("#plus-to-animate").removeAttr('style')
    fabIsOpen = false
}

// Called when the FloatingActionButton is clicked
$("#fab-notes").click(function (e) {
    if (!fabIsOpen && !selectMode) {
        $("#fab-select-note").addClass("show")
        $("#fab-add-note").addClass("show")
        $("#fab-logout-user").addClass("show")
        $("#plus-to-animate").css("transform", "rotate(45deg)")
        fabIsOpen = true
    } else if (fabIsOpen) {
        closeMenu()
    } else if (selectMode) {
        clearSelection()
        closeMenu()
        sleep(500).then(() => {
            $("#fab-add-note").html('<svg height="4.5vw" viewBox="0 0 387.04 387.04"><polygon fill="var(--primary-color)" points="233.05 154.02 233.05 0 154.05 0 154.05 154.04 0 154.04 0 233.01 154.05 233.01 154.05 387.04 233.05 387.04 233.05 233.01 387.04 233.01 387.04 154.02 233.05 154.02" /></svg>')
        })
        selectMode = false
    }
});

$("#fab-select-note").on("click", function () {
    const numberOfChildrenOfPinnedNotes1Div = $("#pinned-notes-1").children().length;
    const numberOfChildrenOfPinnedNotes2Div = $("#pinned-notes-2").children().length;
    const numberOfChildrenOfOtherNotes1Div = $("#other-notes-1").children().length;
    const numberOfChildrenOfOtherNotes2Div = $("#other-notes-2").children().length;
    const notesExist = !(numberOfChildrenOfOtherNotes1Div == 0 && numberOfChildrenOfOtherNotes2Div == 0 && numberOfChildrenOfPinnedNotes1Div == 0 && numberOfChildrenOfPinnedNotes2Div == 0)
    if (!notesExist) {
        showSnackbar("There are no notes to select")
        return
    }
    $("#fab-select-note").removeClass("show")
    $("#fab-logout-user").removeClass("show")
    $("#fab-add-note").html('<svg viewBox="0 0 24 24" height="7vw"><path fill="var(--primary-color)" d="M6,19c0,1.1 0.9,2 2,2h8c1.1,0 2,-0.9 2,-2V7H6v12zM19,4h-3.5l-1,-1h-5l-1,1H5v2h14V4z" /></svg>')
    fabIsOpen = false
    selectMode = true
})

$("#fab-add-note").on("click", function () {
    if (!selectMode) {
        closeMenu()
        openDialog()
    } else {
        openConfirmationDialog("Delete", "Are you sure you want to delete these items?")
        deleteDialogOpen = true
    }
})

let noteBodyDiv = $("#note-body-notes");
let noteBodyDivPlaceholder = $("#note-body-placeholder-notes")

noteBodyDiv.on('input', function () {
    if (noteBodyDiv.text() !== "") {
        noteBodyDivPlaceholder.addClass("hide")
    } else {
        noteBodyDivPlaceholder.removeClass("hide")
    }
});

$("#fab-close-note").on("click", function () {
    if (viewportWidth < 768) {
        $("#card-dialog").removeClass("show");
        $("#card-dialog").css("transform", "translateY(-100vh)")
        $("#add-note-dialog-notes").removeClass("show");
        sleep(500).then(() => {
            $("#add-note-dialog-notes").removeAttr('style')
            $("#card-dialog").removeAttr('style')
        });
        noteDialogOpen = false
    } else {
        $("#fab-close-note").css("display", "none")
    }
    sleep(0.5).then(() => {
        noteBodyDivPlaceholder.removeClass("hide")
        $("#note-body-notes").text("")
        $("#note-title-notes").val("")
    })
    noteIdentifier = {
        pinned: undefined,
        id: undefined
    }
})


// Called when save note button is clicked
$("#fab-save-note").on("click", function () {
    if (noteIdentifier.id !== undefined) {
        createNote(noteIdentifier.pinned)
    } else
        createNote(false)
})

// Called when pin note button is pressed
$("#fab-pin-note").on("click", function () {
    if (noteIdentifier.id !== undefined) {
        createNote(!noteIdentifier.pinned)
    } else
        createNote(true)
})

$("#pinned-notes-1").on("click", "div", function (elem) {
    if (!selectMode) {
        if (fabIsOpen) {
            closeMenu()
        }
        let index = $(this).attr("id").match(/\d+/)[0];
        noteIdentifier = {
            pinned: true,
            id: parseInt(index)
        }
        openDialog(pinnedNotes[index].title, pinnedNotes[index].note)
    } else {
        let targetElement = $(this)
        if (elem.target !== this)
            targetElement = $(elem.target).parent()
        let index = $(this).attr("id").match(/\d+/)[0];
        if (!pinnedSelectedNotesIndices.includes(index)) {
            pinnedSelectedNotesIndices.push(index)
            targetElement.addClass("selected")
            console.log("Selected")
        } else {
            const indexOfIndex = pinnedSelectedNotesIndices.indexOf(index);
            if (indexOfIndex > -1) {
                pinnedSelectedNotesIndices.splice(indexOfIndex, 1);
            }
            targetElement.removeClass("selected")
            console.log("Deselected")
        }
    }
})
$("#pinned-notes-2").on("click", "div", function (elem) {
    if (!selectMode) {
        var index = $(this).attr("id").match(/\d+/)[0];
        noteIdentifier = {
            pinned: true,
            id: parseInt(index)
        }
        openDialog(pinnedNotes[index].title, pinnedNotes[index].note)
    } else {
        let targetElement = $(this)
        if (elem.target !== this)
            targetElement = $(elem.target).parent()
        var index = $(this).attr("id").match(/\d+/)[0];
        if (!pinnedSelectedNotesIndices.includes(index)) {
            pinnedSelectedNotesIndices.push(index)
            targetElement.addClass("selected")
            console.log("Selected")
        } else {
            const indexOfIndex = pinnedSelectedNotesIndices.indexOf(index);
            if (indexOfIndex > -1) {
                pinnedSelectedNotesIndices.splice(indexOfIndex, 1);
            }
            targetElement.removeClass("selected")
            console.log("Deselected")
        }
    }
})

$("#other-notes-1").on("click", "div", function (elem) {
    if (!selectMode) {
        var index = $(this).attr("id").match(/\d+/)[0];
        noteIdentifier = {
            pinned: false,
            id: parseInt(index)
        }
        openDialog(otherNotes[index].title, otherNotes[index].note)
    } else {
        let targetElement = $(this)
        var index = $(this).attr("id").match(/\d+/)[0];
        if (!otherSelectedNotesIndices.includes(index)) {
            otherSelectedNotesIndices.push(index)
            targetElement.addClass("selected")
            console.log("Selected")
        } else {
            const indexOfIndex = otherSelectedNotesIndices.indexOf(index);
            if (indexOfIndex > -1) {
                otherSelectedNotesIndices.splice(indexOfIndex, 1);
            }
            targetElement.removeClass("selected")
            console.log("Deselected")
        }
    }
})
$("#other-notes-2").on("click", "div", function (elem) {
    if (!selectMode) {
        var index = $(this).attr("id").match(/\d+/)[0];
        noteIdentifier = {
            pinned: false,
            id: parseInt(index)
        }
        openDialog(otherNotes[index].title, otherNotes[index].note)
    } else {
        let targetElement = $(this)
        var index = $(this).attr("id").match(/\d+/)[0];
        if (!otherSelectedNotesIndices.includes(index)) {
            otherSelectedNotesIndices.push(index)
            targetElement.addClass("selected")
            console.log("Selected")
        } else {
            const indexOfIndex = otherSelectedNotesIndices.indexOf(index);
            if (indexOfIndex > -1) {
                otherSelectedNotesIndices.splice(indexOfIndex, 1);
            }
            targetElement.removeClass("selected")
            console.log("Deselected")
        }
    }
})

$("#confirmation-dialog-button-no").on("click", function () {
    closeConfirmationDialog()
    deleteDialogOpen = false
    logOutDialogOpen = false
})

$("#confirmation-dialog-button-yes").on("click", function () {
    if (deleteDialogOpen) {
        deleteSelectedNotes()
        closeConfirmationDialog()
        clearSelection()
        closeMenu()
        sleep(500).then(() => {
            $("#fab-add-note").html('<svg height="4.5vw" viewBox="0 0 387.04 387.04"><polygon fill="var(--primary-color)" points="233.05 154.02 233.05 0 154.05 0 154.05 154.04 0 154.04 0 233.01 154.05 233.01 154.05 387.04 233.05 387.04 233.05 233.01 387.04 233.01 387.04 154.02 233.05 154.02" /></svg>')
        })
        selectMode = false
        deleteDialogOpen = false
    } else  if (logOutDialogOpen) {
        Parse.User.logOut().then(() => {
            logOutDialogOpen = false
            closeConfirmationDialog()
            closeMenu()
        });
    }

})

$("#fab-logout-user").on('click', function () {
    openConfirmationDialog("Logout", "Are you sure you want to logout?")
    logOutDialogOpen = true
})

getNotes()