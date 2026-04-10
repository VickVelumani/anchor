from datetime import datetime
from extensions import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    urge_templates = db.relationship(
        "UrgeTemplate",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    urges = db.relationship(
        "Urge",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )


class UrgeTemplate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

    past_self_message = db.Column(db.Text, nullable=True)
    resist_reasons = db.Column(db.Text, nullable=True)
    action_plan = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    urges = db.relationship(
        "Urge",
        backref="template",
        lazy=True,
        cascade="all, delete-orphan"
    )


class Urge(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey("urge_template.id"), nullable=False)

    intensity = db.Column(db.Integer, nullable=False)
    trigger_note = db.Column(db.String(255), nullable=True)

    intervention_type = db.Column(db.String(50), nullable=True)
    intervention_response = db.Column(db.Text, nullable=True)
    outcome = db.Column(db.String(20), nullable=True)
    post_reflection = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)