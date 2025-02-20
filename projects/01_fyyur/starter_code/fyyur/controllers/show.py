import sys
from fyyur import app, db
from fyyur.forms import *
from fyyur.models.show import Show
from fyyur.models.venue import Venue
from fyyur.models.artist import Artist
from sqlalchemy import cast, DATE, func
from fyyur.models.availability import Availability
from flask import Flask, render_template, request, Response, flash, redirect, url_for


@app.route('/shows')
def shows():
    shows = Show.query.join(Venue).join(Artist).with_entities(
        Show.venue_id, Venue.name, Show.artist_id, Artist.name, Artist.image_link, Show.start_time,).all()

    data = []

    for show in shows:
        data.append({
            "venue_id": show[0],
            "venue_name": show[1],
            "artist_id": show[2],
            "artist_name": show[3],
            "artist_image_link": show[4],
            "start_time": show[5]
        })

    return render_template('pages/shows.html', shows=data)


@app.route('/shows/create')
def create_shows():
    form = ShowForm()
    return render_template('forms/new_show.html', form=form)


@app.route('/shows/create', methods=['POST'])
def create_show_submission():
    venue_id = request.form.get('venue_id', '')
    artist_id = request.form.get('artist_id', '')
    start_time = request.form.get('start_time', '')

    artist = Artist.query.get(artist_id)
    if not artist:
        flash('Artist does not exist')
        return redirect(url_for('create_show_submission'))

    venue = Venue.query.get(venue_id)
    if not venue:
        flash('Venue does not exist')
        return redirect(url_for('create_show_submission'))

    start_time_formated = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')

    availability = Availability.query.filter(
        cast(Availability.from_time, DATE) <= start_time_formated,
        cast(Availability.to_time, DATE) >= start_time_formated,
        Availability.artist_id==artist_id
    ).all()

    if len(availability) > 0:
        show = Show(venue_id=venue_id, artist_id=artist_id,
                    start_time=start_time_formated)
        error = False

        try:

            db.session.add(show)
            db.session.commit()
        except:
            error = True
            print(sys.exc_info())
            db.session.rollback()
        finally:
            db.session.close()

        if not error:
            return redirect(url_for('shows'))
        else:
            flash('An error occurred. Show could not be listed.')
            return redirect(url_for('create_show_submission'))
    else:
        flash('The arist is not available at the time selected')
        return redirect(url_for('create_show_submission'))
