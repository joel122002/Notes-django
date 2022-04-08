
# Notes

This is an app made for note-taking. It has basic features like adding updating and deleting a note.

## Installation
Clone the app

```bash
git clone https://github.com/joel122002/Notes-django.git
cd Notes-django/backend
```

[Install django](https://docs.djangoproject.com/en/4.0/topics/install/#s-installing-an-official-release-with-pip) with pip

```bash
  python -m pip install Django
```

To run the project run the following command
```bash
  python manage.py runserver
```
## Environment Variables

To run this project, you will need to add the following environment variables to your `backend/notesapp/static/notes/config.js` file.

`NOTES_PATH`

If you don't want to make any changes and want to use the default routes your `config.js` should look like this.

`config.js`
```js
var config = {
    NOTES_PATH: "/Notes"
}
```

