<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl bg-white border border-gray-300 rounded-lg shadow-md">

      <!-- HEADER -->
      <div class="border-b border-gray-300 px-6 py-3 flex items-center gap-4">
        <img src="/pn-logo.png" alt="School Logo" class="h-12 w-auto" />
        <div>
          <h2 class="text-sm font-semibold text-gray-800 uppercase">
            Passerelles Numériques Cambodia (PNC)
          </h2>
          <h1 class="text-lg font-semibold text-gray-900">
            Student Violence Incident Report
          </h1>
          <p class="text-xs text-gray-600">
            Confidential – For School Use Only
          </p>
        </div>
      </div>

      <!-- FORM -->
      <form @submit.prevent="submitForm" class="px-6 py-4 space-y-4">

        <!-- ROW 1 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="label">Reporting Option *</label>
            <select v-model="form.anonymous" class="input">
              <option value="Yes">Anonymous</option>
              <option value="No">With Name</option>
            </select>
          </div>

          <div v-if="form.anonymous === 'No'">
            <label class="label">Student Name *</label>
            <input v-model="form.name" class="input" />
            <p v-if="errors.name" class="error">{{ errors.name }}</p>
          </div>

          <div>
            <label class="label">Grade / Class *</label>
            <input v-model="form.grade" class="input" />
            <p v-if="errors.grade" class="error">{{ errors.grade }}</p>
          </div>
        </div>

        <!-- ROW 2 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="label">Type of Incident *</label>
            <select v-model="form.violenceType" class="input">
              <option disabled value="">Select</option>
              <option>Bullying</option>
              <option>Physical Violence</option>
              <option>Verbal Abuse</option>
              <option>Sexual Harassment</option>
              <option>Online / Cyber Violence</option>
            </select>
            <p v-if="errors.violenceType" class="error">{{ errors.violenceType }}</p>
          </div>

          <div>
            <label class="label">Location *</label>
            <select v-model="form.location" class="input">
              <option disabled value="">Select</option>
              <option>Classroom</option>
              <option>School Yard</option>
              <option>Hallway</option>
              <option>Toilet</option>
              <option>Online</option>
              <option>Outside School</option>
            </select>
            <p v-if="errors.location" class="error">{{ errors.location }}</p>
          </div>

          <div>
            <label class="label">Support Required *</label>
            <select v-model="form.support" class="input">
              <option disabled value="">Select</option>
              <option>Teacher consultation</option>
              <option>Counselor support</option>
              <option>Protection / Safety</option>
              <option>Medical assistance</option>
              <option>Not sure</option>
            </select>
            <p v-if="errors.support" class="error">{{ errors.support }}</p>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <div>
          <label class="label">Description of Incident *</label>
          <textarea
            v-model="form.description"
            class="input h-24"
            placeholder="Describe what happened clearly and factually"
          ></textarea>
          <p v-if="errors.description" class="error">{{ errors.description }}</p>
        </div>

        <!-- SUBMIT -->
        <div class="flex justify-end pt-3 border-t border-gray-200">
          <button
            :disabled="submitting"
            class="px-6 py-3 bg-blue-700 text-white text-sm font-medium rounded
                   hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ submitting ? "Submitting..." : "Submit Report" }}
          </button>
        </div>
      </form>

      <notifications group="app" position="top right" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import { sendReport } from "./api";

const { notify } = useNotification();
const submitting = ref(false);

const form = reactive({
  anonymous: "Yes",
  name: "",
  grade: "",
  violenceType: "",
  location: "",
  support: "",
  description: ""
});

const errors = reactive({
  name: "",
  grade: "",
  violenceType: "",
  location: "",
  support: "",
  description: ""
});

const validateForm = () => {
  let valid = true;
  Object.keys(errors).forEach(k => (errors[k] = ""));

  if (form.anonymous === "No" && !form.name.trim()) {
    errors.name = "Student name is required";
    valid = false;
  }

  if (!form.grade.trim()) {
    errors.grade = "Grade / Class is required";
    valid = false;
  }

  if (!form.violenceType) {
    errors.violenceType = "Incident type is required";
    valid = false;
  }

  if (!form.location) {
    errors.location = "Location is required";
    valid = false;
  }

  if (!form.support) {
    errors.support = "Support selection is required";
    valid = false;
  }

  if (!form.description.trim()) {
    errors.description = "Description is required";
    valid = false;
  }

  return valid;
};

const submitForm = async () => {
  if (submitting.value) return;

  if (!validateForm()) {
    notify({
      group: "app",
      title: "Incomplete Form",
      text: "⚠️ Please complete all required fields",
      type: "warn"
    });
    return;
  }

  submitting.value = true;

  try {
    await sendReport(form);

    notify({
      group: "app",
      title: "Submitted",
      text: "✅ Your report has been submitted successfully",
      type: "success"
    });

    Object.assign(form, {
      anonymous: "Yes",
      name: "",
      grade: "",
      violenceType: "",
      location: "",
      support: "",
      description: ""
    });

  } catch (err) {
    notify({
      group: "app",
      title: "Error",
      text: "❌ Failed to submit report",
      type: "error"
    });
    console.error(err);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.label {
  @apply block text-xs font-medium text-gray-700 mb-1;
}

.input {
  @apply w-full border border-gray-300 px-3 py-2 text-sm rounded
         focus:outline-none focus:ring-1 focus:ring-blue-600;
}

.error {
  @apply text-xs text-red-600 mt-1;
}
</style>
