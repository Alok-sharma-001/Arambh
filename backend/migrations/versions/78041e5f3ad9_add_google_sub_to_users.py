"""add_google_sub_to_users

Revision ID: 78041e5f3ad9
Revises: c6903c7562ed
Create Date: 2026-07-27 21:10:25.960535

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '78041e5f3ad9'
down_revision: Union[str, Sequence[str], None] = 'c6903c7562ed'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('google_sub', sa.String(), nullable=True))
        batch_op.alter_column('hashed_password', existing_type=sa.VARCHAR(), nullable=True)
        batch_op.create_index(op.f('ix_users_google_sub'), ['google_sub'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_index(op.f('ix_users_google_sub'))
        batch_op.alter_column('hashed_password', existing_type=sa.VARCHAR(), nullable=False)
        batch_op.drop_column('google_sub')
