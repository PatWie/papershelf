PaperShelf
=============

This is a self-hosting solution for managing BibTex and Papers (pdf). It only requires PHP 5.3 and runs out of the box. No Database! 

###features
includes:
- [AngularJS][ng] (one-page-application) and easy interface
- Fuzzy-search using [Fuse.js][fusejs] and [MassAutocomplete][massauto]
- drag and drop upload for pdfs using [DropZone][dropzone]
- speaks [natively bibtex][bib2json]
- raw bibtex editor and single form elements are syncronized
- copy bibtex [to clipboard][zeroclip]
- thumb-preview generator
- custom rating of papers

planned:
- MathJax notes
- mobile version (only view, no edit)
- LDA for auto-topic recovery

### Requirements and Installation
You just need PHP. For generating the preview-thumbnails make sure you can execute "imagemagick" in php by crontab. To install this script just upload it to you webserver and make the directory "db" writeable by

    chown www-data:www-data -R db
    chmod 775 -R db


###screenshot
![screenshot](https://raw.githubusercontent.com/PatWie/papershelf/master/screenshot.png)

[ng]:https://angularjs.org/
[fusejs]:http://kiro.me/projects/fuse.html
[dropzone]:http://www.dropzonejs.com/
[bib2json]:https://github.com/mayanklahiri/bib2json
[zeroclip]:http://zeroclipboard.org/
[massauto]:http://hakib.github.io/MassAutocomplete/