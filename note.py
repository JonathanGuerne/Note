import argparse
import os
import datetime
import codecs
import locale
import markdown
locale.setlocale(locale.LC_TIME, '')


def str2bool(v):
    if isinstance(v, bool):
        return v
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')


verboseprint = print


def fun_parse():
    """
    create the parser with all needed argument
    output the args as an object
    """

    parser = argparse.ArgumentParser(description='create some md note files. ')
    # argument for ignoring already created note files
    parser.add_argument(
        '-i', '--ignore',
        help='ignore (write over) already existing file for this date.',
        type=str2bool,
        nargs='?',
        const=True,
        default=False)

    parser.add_argument(
        '-m', '--merge',
        help='merge all files in the notes folder into a single file.',
        type=str2bool,
        nargs='?',
        const=True,
        default=False)

    parser.add_argument(
        '-v', '--verbose',
        help='verbose level of the application. To avoid too much print',
        type=int, default=1
    )

    # TODO can use an specified date

    return parser.parse_args()


def create_file(args, date=datetime.datetime.now(), _ntab=1):
    """

    create a file for a given date (default now())
    if there is no file for the specified date or if 
    the user use the argument --ignore will create a new file and return True

    """

    date_file = date.strftime("%Y_%m_%d_note.md")
    header = date.strftime("%A %d %B %Y")

    if date_file in os.listdir("notes/") and not args.ignore:
        verboseprint('\t'*_ntab+'ERROR: specified date file already found')
        verboseprint('\t'*_ntab+'please use -i or --ignore to force a rewrite')

        return False

    else:
        f = codecs.open('notes/'+date_file, "w+", 'utf-8')
        f.write("# " + header)
        f.close()


def merge_files(args):
    """
    merge all files in the notes folder into a `all_notes.md` file
    """

    output = ["""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <link href="avenir-white.css" type="text/css" rel="stylesheet" />
            <link href="default.css" type="text/css" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Journal de bord</title>
        </head>
        <body>

        <table>

        <tr>

        <td colspan="2">
        <label for="searchInput">Rechercher une expression: </label>

        <input type="text" id="searchInput" onkeyup="search_function()" placeholder="Rechercher...">
        </td>

        </tr>

        <tr>

        <td colspan="2">
            <input type="button"value="Aujourd'hui" onclick="current_day();">

            <input type="button"value="Cette semaine" onclick="current_week();">

            <input type="button"value="Ce mois" onclick="current_month();">
            <input type="button"value="Reset" onclick="reset_calendar();">

            <input style="float: right;" type="button"value="Imprimer" onclick="print_content();">
        </td>

        </tr>

        <tr>
        <td>
            <label for="start">Premier jour à afficher</label>
        </td>
        <td style="text-align:right;">
                    <label for="end">Dernier jour à afficher</label>
        
        </td>
        </tr>
        <tr>
        <td>
        <div>
            

            <input type="date" id="start" name="note-start"
                value="2020-08-10"
                min="2020-08-10" max="2021-02-01" onchange="all_date_handler();">
        </div>
        </td>
        <td style="text-align:right;">
        <div>


            <input type="date" id="end" name="note-end"
                value="2021-02-01"
                min="2020-08-10" max="2021-02-01" onchange="all_date_handler();">
        </div>
        </td>
        </tr>
        </table>

        <div id="content">
   
    """]

    md = markdown.Markdown(output_format='html5')

    for f in os.listdir('notes/')[::-1]:

        _date = f[:10]

        with codecs.open('notes/'+f, 'r', 'utf-8') as f_content:
            output.append('<div id="{}" class="note">'.format(_date))
            output.append('<div class="datetext">')
            # output.append(md.convert(f_content.read()))
            
            html = md.convert(f_content.read())
            output.append(html.replace("<h2>", '</div><div class="subnote"><h2>'))

            output.append('</div>')
            output.append("</div>")

    output.append("""
</div>

    </body>

    <script type="text/javascript" src="script.js"></script>

    </html>
    """)

    with open('all_notes.html', 'w', encoding='utf-8', errors='xmlcharrefreplace') as f_out:
        f_out.write("".join(output))


if __name__ == "__main__":

    args = fun_parse()

    # setup verbose print
    if args.verbose < 1:
        verboseprint = lambda *a, **k: None

    verboseprint()
    verboseprint('~'*10 + ' Note file Tool ' + '~'*10)

    if not args.merge:
        verboseprint('Creating note file for today')
        create_file(args)
        verboseprint()

    else:

        verboseprint('Generating note file with all notes')
        merge_files(args)
