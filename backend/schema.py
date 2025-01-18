from flask import Config
import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
import stripe
from models import ToDo, User
from models import db

# Define GraphQL object types
class UserType(SQLAlchemyObjectType):
    class Meta:
        model = User

class ToDoType(SQLAlchemyObjectType):
    class Meta:
        model = ToDo

# Query definition
class Query(graphene.ObjectType):
    all_todos = graphene.List(ToDoType)

    def resolve_all_todos(self, info):
        # Retrieve authenticated user
        user = info.context['user']  # Fetch the user from context
        if not user:
            raise Exception("Authentication required")
        return ToDo.query.filter_by(user_id=user.id).all()

class DeleteToDoMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)  # To identify the To-Do item to delete

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, id):
        # Retrieve authenticated user
        user = info.context.get('user')
        if not user:
            raise Exception("Authentication required")

        # Find the To-Do item
        todo = ToDo.query.filter_by(id=id, user_id=user.id).first()
        if not todo:
            raise Exception("To-Do item not found or you don't have permission to delete it")

        # Delete the To-Do item
        db.session.delete(todo)
        db.session.commit()

        return DeleteToDoMutation(success=True, message="To-Do item deleted successfully")

class UpdateToDoMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)  # ID of the To-Do item to update
        title = graphene.String()        # Optional new title
        description = graphene.String()  # Optional new description
        time = graphene.DateTime()       # Optional new time

    todo = graphene.Field(ToDoType)      # Return the updated To-Do item

    def mutate(self, info, id, title=None, description=None, time=None):
        # Retrieve authenticated user
        user = info.context.get('user')
        if not user:
            raise Exception("Authentication required")

        # Find the To-Do item
        todo = ToDo.query.filter_by(id=id, user_id=user.id).first()
        if not todo:
            raise Exception("To-Do item not found or you don't have permission to update it")

        # Update fields if provided
        if title is not None:
            todo.title = title
        if description is not None:
            todo.description = description
        if time is not None:
            todo.time = time

        # Commit changes to the database
        db.session.commit()

        return UpdateToDoMutation(todo=todo)


# Mutation for creating a to-do
class CreateToDoMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        time = graphene.DateTime()

    todo = graphene.Field(ToDoType)

    def mutate(self, info, title, description, time):
        # Retrieve authenticated user
        user = info.context.get('user')
        if user is None:
            raise Exception("Authentication required")

        new_todo = ToDo(
            title=title,
            description=description,
            time=time,
            user_id=user.id
        )
        db.session.add(new_todo)
        db.session.commit()
        return CreateToDoMutation(todo=new_todo)

# Mutation for upgrading to Pro
class UpgradeToProMutation(graphene.Mutation):
    class Arguments:
        token = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, token):
        # Get the authenticated user
        user = info.context.get('user')
        if not user:
            raise Exception("Authentication required")

        # Use Stripe to process payment
        stripe.api_key = Config.STRIPE_API_KEY
        try:
            charge = stripe.Charge.create(
                amount=1000,  # $10 in cents
                currency="usd",
                source=token,
                description=f"Upgrade to Pro for {user.username}",
            )
            # Update the user's Pro status
            user.is_pro = True
            db.session.commit()
            return UpgradeToProMutation(success=True, message="Successfully upgraded to Pro!")
        except stripe.error.StripeError as e:
            return UpgradeToProMutation(success=False, message=f"Payment failed: {e.user_message}")

# Mutation for uploading an image
class UploadImageMutation(graphene.Mutation):
    class Arguments:
        todo_id = graphene.Int(required=True)
        image = graphene.String(required=True)  # Image encoded as base64

    success = graphene.Boolean()
    message = graphene.String()
    todo = graphene.Field(ToDoType)

    def mutate(self, info, todo_id, image):
        # Get the authenticated user
        user = info.context.get('user')
        if not user:
            raise Exception("Authentication required")

        if not user.is_pro:
            raise Exception("Pro license required for image uploads")

        # Retrieve the todo item
        todo = ToDo.query.filter_by(id=todo_id, user_id=user.id).first()
        if not todo:
            raise Exception("ToDo item not found")

        # Handle image upload (decoding base64 and saving the file)
        import base64
        from datetime import datetime
        filename = f"{datetime.utcnow().isoformat()}-{todo_id}.png"
        filepath = f"uploads/{filename}"
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(image))

        todo.image = filepath
        db.session.commit()

        return UploadImageMutation(success=True, message="Image uploaded successfully", todo=todo)


# Define the Mutation class
class Mutation(graphene.ObjectType):
    create_to_do = CreateToDoMutation.Field()
    upgrade_to_pro = UpgradeToProMutation.Field()
    upload_image = UploadImageMutation.Field()
    delete_to_do = DeleteToDoMutation.Field()
    update_to_do = UpdateToDoMutation.Field()

# Define the schema
schema = graphene.Schema(query=Query, mutation=Mutation)
