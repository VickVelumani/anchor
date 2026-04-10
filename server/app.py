from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
)
from config import Config
from extensions import db, bcrypt, jwt
from models import User, Urge, UrgeTemplate

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)


@app.route("/")
def home():
    return {"message": "Anchor backend is running"}


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()

    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200


# =========================
# URGE TEMPLATES
# =========================

@app.route("/urge-templates", methods=["GET"])
@jwt_required()
def get_urge_templates():
    user_id = int(get_jwt_identity())

    templates = UrgeTemplate.query.filter_by(user_id=user_id).order_by(UrgeTemplate.created_at.desc()).all()

    result = []
    for template in templates:
        result.append({
            "id": template.id,
            "name": template.name,
            "description": template.description,
            "past_self_message": template.past_self_message,
            "resist_reasons": template.resist_reasons,
            "action_plan": template.action_plan,
            "created_at": template.created_at
        })

    return jsonify(result), 200


@app.route("/urge-templates", methods=["POST"])
@jwt_required()
def create_urge_template():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    name = data.get("name", "").strip()
    description = data.get("description", "").strip()
    past_self_message = data.get("past_self_message", "").strip()
    resist_reasons = data.get("resist_reasons", "").strip()
    action_plan = data.get("action_plan", "").strip()

    if not name:
        return jsonify({"error": "Urge name is required"}), 400

    new_template = UrgeTemplate(
        user_id=user_id,
        name=name,
        description=description,
        past_self_message=past_self_message,
        resist_reasons=resist_reasons,
        action_plan=action_plan
    )

    db.session.add(new_template)
    db.session.commit()

    return jsonify({
        "message": "Urge template created successfully",
        "id": new_template.id,
        "name": new_template.name,
        "description": new_template.description,
        "past_self_message": new_template.past_self_message,
        "resist_reasons": new_template.resist_reasons,
        "action_plan": new_template.action_plan
    }), 201


@app.route("/urge-templates/<int:template_id>", methods=["GET"])
@jwt_required()
def get_single_urge_template(template_id):
    user_id = int(get_jwt_identity())

    template = UrgeTemplate.query.get(template_id)

    if not template:
        return jsonify({"error": "Urge template not found"}), 404

    if template.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({
        "id": template.id,
        "name": template.name,
        "description": template.description,
        "past_self_message": template.past_self_message,
        "resist_reasons": template.resist_reasons,
        "action_plan": template.action_plan,
        "created_at": template.created_at
    }), 200


@app.route("/urge-templates/<int:template_id>", methods=["PUT"])
@jwt_required()
def update_urge_template(template_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    template = UrgeTemplate.query.get(template_id)

    if not template:
        return jsonify({"error": "Urge template not found"}), 404

    if template.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "Urge name is required"}), 400

    template.name = name
    template.description = data.get("description", "").strip()
    template.past_self_message = data.get("past_self_message", "").strip()
    template.resist_reasons = data.get("resist_reasons", "").strip()
    template.action_plan = data.get("action_plan", "").strip()

    db.session.commit()

    return jsonify({
        "message": "Urge template updated successfully",
        "id": template.id,
        "name": template.name,
        "description": template.description,
        "past_self_message": template.past_self_message,
        "resist_reasons": template.resist_reasons,
        "action_plan": template.action_plan
    }), 200


# =========================
# LOGGED URGES
# =========================

@app.route("/urges", methods=["POST"])
@jwt_required()
def create_urge():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    template_id = data.get("template_id")
    intensity = data.get("intensity")
    trigger_note = data.get("trigger_note")

    if not template_id or intensity is None:
        return jsonify({"error": "template_id and intensity are required"}), 400

    template = UrgeTemplate.query.get(template_id)

    if not template:
        return jsonify({"error": "Urge template not found"}), 404

    if template.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    new_urge = Urge(
        user_id=user_id,
        template_id=template_id,
        intensity=intensity,
        trigger_note=trigger_note
    )

    db.session.add(new_urge)
    db.session.commit()

    return jsonify({
        "message": "Urge logged",
        "id": new_urge.id
    }), 201


@app.route("/urges", methods=["GET"])
@jwt_required()
def get_urges():
    user_id = int(get_jwt_identity())

    urges = Urge.query.filter_by(user_id=user_id).order_by(Urge.created_at.desc()).all()

    result = []
    for urge in urges:
        result.append({
            "id": urge.id,
            "template_id": urge.template_id,
            "template_name": urge.template.name if urge.template else None,
            "intensity": urge.intensity,
            "trigger_note": urge.trigger_note,
            "intervention_type": urge.intervention_type,
            "intervention_response": urge.intervention_response,
            "outcome": urge.outcome,
            "post_reflection": urge.post_reflection,
            "created_at": urge.created_at
        })

    return jsonify(result), 200


@app.route("/urges/<int:urge_id>", methods=["GET"])
@jwt_required()
def get_single_urge(urge_id):
    user_id = int(get_jwt_identity())

    urge = Urge.query.get(urge_id)

    if not urge:
        return jsonify({"error": "Urge not found"}), 404

    if urge.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({
        "id": urge.id,
        "template_id": urge.template_id,
        "template_name": urge.template.name if urge.template else None,
        "template_description": urge.template.description if urge.template else None,
        "past_self_message": urge.template.past_self_message if urge.template else "",
        "resist_reasons": urge.template.resist_reasons if urge.template else "",
        "action_plan": urge.template.action_plan if urge.template else "",
        "intensity": urge.intensity,
        "trigger_note": urge.trigger_note,
        "intervention_type": urge.intervention_type,
        "intervention_response": urge.intervention_response,
        "outcome": urge.outcome,
        "post_reflection": urge.post_reflection,
        "created_at": urge.created_at
    }), 200


@app.route("/urges/<int:urge_id>", methods=["PUT"])
@jwt_required()
def update_urge(urge_id):
    data = request.get_json()
    user_id = int(get_jwt_identity())

    urge = Urge.query.get(urge_id)

    if not urge:
        return jsonify({"error": "Urge not found"}), 404

    if urge.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    urge.intervention_type = data.get("intervention_type")
    urge.intervention_response = data.get("intervention_response")
    urge.outcome = data.get("outcome")
    urge.post_reflection = data.get("post_reflection")

    db.session.commit()

    return jsonify({"message": "Urge updated"}), 200


# =========================
# STATS
# =========================

@app.route("/stats/summary", methods=["GET"])
@jwt_required()
def get_stats_summary():
    user_id = int(get_jwt_identity())

    urges = Urge.query.filter_by(user_id=user_id).all()

    total_urges = len(urges)
    resisted_count = sum(1 for urge in urges if urge.outcome == "resisted")
    gave_in_count = sum(1 for urge in urges if urge.outcome == "gave_in")

    success_rate = 0
    if total_urges > 0:
        success_rate = round((resisted_count / total_urges) * 100, 2)

    current_streak = 0
    sorted_urges = sorted(urges, key=lambda urge: urge.created_at, reverse=True)

    for urge in sorted_urges:
        if urge.outcome == "resisted":
            current_streak += 1
        elif urge.outcome == "gave_in":
            break

    return jsonify({
        "total_urges": total_urges,
        "resisted_count": resisted_count,
        "gave_in_count": gave_in_count,
        "success_rate": success_rate,
        "current_streak": current_streak
    }), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)