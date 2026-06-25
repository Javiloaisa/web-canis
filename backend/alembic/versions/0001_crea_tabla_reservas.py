"""crea tabla reservas

Revision ID: 0001
Revises:
Create Date: 2026-06-25

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "reservas",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("franja", sa.Time(), nullable=False),
        sa.Column("quiere_paella", sa.Boolean(), nullable=False),
        sa.Column("nombre", sa.String(), nullable=False),
        sa.Column("telefono", sa.String(), nullable=False),
        sa.Column("personas", sa.Integer(), nullable=False),
        sa.Column(
            "estado", sa.String(), nullable=False, server_default="confirmada"
        ),
        sa.Column("origen", sa.String(), nullable=False),
        sa.Column(
            "creada_en",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )
    op.create_index(
        "idx_reservas_disp",
        "reservas",
        ["fecha", "franja"],
        postgresql_where=sa.text("estado = 'confirmada'"),
    )


def downgrade() -> None:
    op.drop_index("idx_reservas_disp", table_name="reservas")
    op.drop_table("reservas")
