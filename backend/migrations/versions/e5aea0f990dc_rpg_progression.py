"""rpg_progression

Revision ID: e5aea0f990dc
Revises: c6f0eebb3b2e
Create Date: 2026-06-11 12:46:04.729597

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5aea0f990dc'
down_revision: Union[str, Sequence[str], None] = 'c6f0eebb3b2e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('user_stats', sa.Column('player_class', sa.String(), nullable=True))
    op.add_column('user_stats', sa.Column('rank', sa.String(), server_default='Novice', nullable=True))
    op.add_column('user_stats', sa.Column('title', sa.String(), nullable=True))

    op.create_table(
        'inventory_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('item_id', sa.String(), nullable=False),
        sa.Column('acquired_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_inventory_items_id'), 'inventory_items', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_inventory_items_id'), table_name='inventory_items')
    op.drop_table('inventory_items')
    op.drop_column('user_stats', 'title')
    op.drop_column('user_stats', 'rank')
    op.drop_column('user_stats', 'player_class')
