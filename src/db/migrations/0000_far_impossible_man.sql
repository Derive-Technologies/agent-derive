CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"subdomain" varchar(100) NOT NULL,
	"domain" varchar(255),
	"description" text,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"subscription_tier" varchar(50) DEFAULT 'starter' NOT NULL,
	"subscription_status" varchar(50) DEFAULT 'active' NOT NULL,
	"billing_email" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_subdomain_unique" UNIQUE("subdomain")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"avatar" text,
	"phone_number" varchar(20),
	"title" varchar(100),
	"department" varchar(100),
	"auth_provider" varchar(50) DEFAULT 'email' NOT NULL,
	"auth_id" varchar(255),
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"last_login_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "tenant_users" (
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"invited_by" uuid,
	"invited_at" timestamp with time zone,
	"joined_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_users_tenant_id_user_id_pk" PRIMARY KEY("tenant_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"description" text,
	"is_system_role" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"resource" varchar(50) NOT NULL,
	"action" varchar(50) NOT NULL,
	"is_system_permission" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"version" integer DEFAULT 1 NOT NULL,
	"is_template" boolean DEFAULT false NOT NULL,
	"template_id" uuid,
	"definition" jsonb NOT NULL,
	"triggers" jsonb DEFAULT '{}'::jsonb,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" uuid NOT NULL,
	"execution_number" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"trigger_type" varchar(50) NOT NULL,
	"trigger_data" jsonb,
	"input" jsonb DEFAULT '{}'::jsonb,
	"output" jsonb DEFAULT '{}'::jsonb,
	"variables" jsonb DEFAULT '{}'::jsonb,
	"current_step_id" varchar(100),
	"step_states" jsonb DEFAULT '{}'::jsonb,
	"execution_path" jsonb DEFAULT '[]'::jsonb,
	"error" text,
	"error_details" jsonb,
	"metrics" jsonb DEFAULT '{}'::jsonb,
	"priority" integer DEFAULT 0 NOT NULL,
	"scheduled_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approval_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_id" uuid NOT NULL,
	"step_id" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) DEFAULT 'manual' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"approval_type" varchar(50) DEFAULT 'single' NOT NULL,
	"required_approvals" integer DEFAULT 1 NOT NULL,
	"received_approvals" integer DEFAULT 0 NOT NULL,
	"request_data" jsonb DEFAULT '{}'::jsonb,
	"approval_data" jsonb DEFAULT '{"decisions":[]}'::jsonb,
	"escalation_rules" jsonb,
	"requested_by" uuid NOT NULL,
	"assigned_to" jsonb DEFAULT '[]'::jsonb,
	"approved_by" uuid,
	"expires_at" timestamp with time zone,
	"responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_agent_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_id" uuid NOT NULL,
	"step_id" varchar(100) NOT NULL,
	"task_name" varchar(255) NOT NULL,
	"agent_type" varchar(100) NOT NULL,
	"model" varchar(100),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"prompt" text NOT NULL,
	"system_prompt" text,
	"context" jsonb DEFAULT '{}'::jsonb,
	"input" jsonb DEFAULT '{}'::jsonb,
	"output" jsonb,
	"configuration" jsonb DEFAULT '{}'::jsonb,
	"usage" jsonb,
	"error" text,
	"error_details" jsonb,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"cost_estimate" numeric(10, 4),
	"actual_cost" numeric(10, 4),
	"requested_by" uuid NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"resource" varchar(100) NOT NULL,
	"resource_id" uuid,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"severity" varchar(20) DEFAULT 'info' NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"correlation_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tenant_users" ADD CONSTRAINT "tenant_users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_users" ADD CONSTRAINT "tenant_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_users" ADD CONSTRAINT "tenant_users_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_template_id_workflows_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_cancelled_by_users_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_execution_id_workflow_executions_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."workflow_executions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_agent_tasks" ADD CONSTRAINT "ai_agent_tasks_execution_id_workflow_executions_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."workflow_executions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_agent_tasks" ADD CONSTRAINT "ai_agent_tasks_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tenants_subdomain_idx" ON "tenants" USING btree ("subdomain");--> statement-breakpoint
CREATE INDEX "tenants_domain_idx" ON "tenants" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "tenants_subscription_tier_idx" ON "tenants" USING btree ("subscription_tier");--> statement-breakpoint
CREATE INDEX "tenants_is_active_idx" ON "tenants" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_auth_provider_auth_id_idx" ON "users" USING btree ("auth_provider","auth_id");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "users_last_login_at_idx" ON "users" USING btree ("last_login_at");--> statement-breakpoint
CREATE INDEX "tenant_users_tenant_id_idx" ON "tenant_users" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_users_user_id_idx" ON "tenant_users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tenant_users_role_idx" ON "tenant_users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "tenant_users_status_idx" ON "tenant_users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tenant_users_is_active_idx" ON "tenant_users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "roles_tenant_id_name_idx" ON "roles" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE INDEX "roles_tenant_id_idx" ON "roles" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "roles_is_system_role_idx" ON "roles" USING btree ("is_system_role");--> statement-breakpoint
CREATE INDEX "roles_is_active_idx" ON "roles" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "permissions_name_idx" ON "permissions" USING btree ("name");--> statement-breakpoint
CREATE INDEX "permissions_category_idx" ON "permissions" USING btree ("category");--> statement-breakpoint
CREATE INDEX "permissions_resource_action_idx" ON "permissions" USING btree ("resource","action");--> statement-breakpoint
CREATE INDEX "permissions_is_system_permission_idx" ON "permissions" USING btree ("is_system_permission");--> statement-breakpoint
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX "workflows_tenant_id_idx" ON "workflows" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "workflows_name_idx" ON "workflows" USING btree ("name");--> statement-breakpoint
CREATE INDEX "workflows_category_idx" ON "workflows" USING btree ("category");--> statement-breakpoint
CREATE INDEX "workflows_status_idx" ON "workflows" USING btree ("status");--> statement-breakpoint
CREATE INDEX "workflows_is_active_idx" ON "workflows" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "workflows_is_template_idx" ON "workflows" USING btree ("is_template");--> statement-breakpoint
CREATE INDEX "workflows_template_id_idx" ON "workflows" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "workflows_created_by_idx" ON "workflows" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "workflows_created_at_idx" ON "workflows" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_workflow_id_idx" ON "workflow_executions" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "workflow_executions_status_idx" ON "workflow_executions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "workflow_executions_trigger_type_idx" ON "workflow_executions" USING btree ("trigger_type");--> statement-breakpoint
CREATE INDEX "workflow_executions_created_by_idx" ON "workflow_executions" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "workflow_executions_scheduled_at_idx" ON "workflow_executions" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_started_at_idx" ON "workflow_executions" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_completed_at_idx" ON "workflow_executions" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_created_at_idx" ON "workflow_executions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_workflow_execution_number_idx" ON "workflow_executions" USING btree ("workflow_id","execution_number");--> statement-breakpoint
CREATE INDEX "approval_requests_execution_id_idx" ON "approval_requests" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "approval_requests_step_id_idx" ON "approval_requests" USING btree ("step_id");--> statement-breakpoint
CREATE INDEX "approval_requests_status_idx" ON "approval_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "approval_requests_priority_idx" ON "approval_requests" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "approval_requests_requested_by_idx" ON "approval_requests" USING btree ("requested_by");--> statement-breakpoint
CREATE INDEX "approval_requests_approved_by_idx" ON "approval_requests" USING btree ("approved_by");--> statement-breakpoint
CREATE INDEX "approval_requests_expires_at_idx" ON "approval_requests" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "approval_requests_created_at_idx" ON "approval_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "ai_agent_tasks_execution_id_idx" ON "ai_agent_tasks" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "ai_agent_tasks_step_id_idx" ON "ai_agent_tasks" USING btree ("step_id");--> statement-breakpoint
CREATE INDEX "ai_agent_tasks_status_idx" ON "ai_agent_tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_agent_tasks_agent_type_idx" ON "ai_agent_tasks" USING btree ("agent_type");--> statement-breakpoint
CREATE INDEX "ai_agent_tasks_priority_idx" ON "ai_agent_tasks" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "ai_agent_tasks_requested_by_idx" ON "ai_agent_tasks" USING btree ("requested_by");--> statement-breakpoint
CREATE INDEX "ai_agent_tasks_started_at_idx" ON "ai_agent_tasks" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "ai_agent_tasks_completed_at_idx" ON "ai_agent_tasks" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "ai_agent_tasks_created_at_idx" ON "ai_agent_tasks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_tenant_id_idx" ON "audit_logs" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource");--> statement-breakpoint
CREATE INDEX "audit_logs_resource_id_idx" ON "audit_logs" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX "audit_logs_category_idx" ON "audit_logs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "audit_logs_severity_idx" ON "audit_logs" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "audit_logs_correlation_id_idx" ON "audit_logs" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_action_resource_idx" ON "audit_logs" USING btree ("action","resource");--> statement-breakpoint
CREATE INDEX "audit_logs_tenant_id_created_at_idx" ON "audit_logs" USING btree ("tenant_id","created_at");