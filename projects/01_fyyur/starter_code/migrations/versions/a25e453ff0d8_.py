"""empty message

Revision ID: a25e453ff0d8
Revises: 14de614b15d6
Create Date: 2019-11-06 14:51:15.124994

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a25e453ff0d8'
down_revision = '14de614b15d6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('show', sa.Column('artist_id', sa.Integer(), nullable=True))
    op.add_column('show', sa.Column('venue_id', sa.Integer(), nullable=True))
    op.drop_constraint('show_artist_fkey', 'show', type_='foreignkey')
    op.drop_constraint('show_venue_fkey', 'show', type_='foreignkey')
    op.create_foreign_key(None, 'show', 'artists', ['artist_id'], ['id'])
    op.create_foreign_key(None, 'show', 'venues', ['venue_id'], ['id'])
    op.drop_column('show', 'artist')
    op.drop_column('show', 'venue')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('show', sa.Column('venue', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('show', sa.Column('artist', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'show', type_='foreignkey')
    op.drop_constraint(None, 'show', type_='foreignkey')
    op.create_foreign_key('show_venue_fkey', 'show', 'venues', ['venue'], ['id'])
    op.create_foreign_key('show_artist_fkey', 'show', 'artists', ['artist'], ['id'])
    op.drop_column('show', 'venue_id')
    op.drop_column('show', 'artist_id')
    # ### end Alembic commands ###
