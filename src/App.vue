<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">

    <!-- CARD -->
    <div class="w-full max-w-4xl bg-white border border-gray-300 rounded-lg shadow-md">

      <!-- HEADER -->
      <div class="border-b border-gray-300 px-6 py-3 flex items-center gap-4">
        <img src="/pn-logo.png" alt="School Logo" class="h-12 w-auto" />
        <div>
          <h2 class="text-sm font-semibold text-gray-800 uppercase">
            Passerelles Numériques Cambodia (PNC)
          </h2>
          <h1 class="text-lg font-semibold text-gray-900 leading-tight">
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
            <label class="label">Reporting Option</label>
            <select v-model="form.anonymous" class="input">
              <option value="Yes">Anonymous</option>
              <option value="No">With Name</option>
            </select>
          </div>

          <div v-if="form.anonymous === 'No'">
            <label class="label">Student Name</label>
            <input v-model="form.name" class="input" placeholder="Enter your name"/>
          </div>

          <div>
            <label class="label">Grade / Class</label>
            <input v-model="form.grade" class="input" placeholder="e.g. 2025A"/>
          </div>
        </div>

        <!-- ROW 2 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="label">Type of Incident</label>
            <select v-model="form.violenceType" class="input">
              <option disabled value="">Select</option>
              <option>Bullying</option>
              <option>Physical Violence</option>
              <option>Verbal Abuse</option>
              <option>Sexual Harassment</option>
              <option>Online / Cyber Violence</option>
            </select>
          </div>

          <div>
            <label class="label">Location</label>
            <select v-model="form.location" class="input">
              <option disabled value="">Select</option>
              <option>Classroom</option>
              <option>School Yard</option>
              <option>Hallway</option>
              <option>Toilet</option>
              <option>Online</option>
              <option>Outside School</option>
            </select>
          </div>

          <div>
            <label class="label">Support Required</label>
            <select v-model="form.support" class="input">
              <option disabled value="">Select</option>
              <option>Teacher consultation</option>
              <option>Counselor support</option>
              <option>Protection / Safety</option>
              <option>Medical assistance</option>
              <option>Not sure</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="label">Description of Incident</label>
          <textarea
            v-model="form.description"
            class="input h-24"
            placeholder="Provide factual description of the incident"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end pt-2 border-t border-gray-200">
          <button
            :disabled="submitting"
            class="px-6 py-3 bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ submitting ? "Submitting..." : "Submit Report" }}
          </button>
        </div>
      </form>

      <!-- Notifications -->
      <notifications group="app" position="top right" />

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useNotification } from '@kyvg/vue3-notification';
import { sendReport } from "./api";

const { notify } = useNotification();

const form = reactive({
  anonymous: "Yes",
  name: "",
  grade: "",
  violenceType: "",
  location: "",
  description: "",
  support: ""
});

const submitting = ref(false);

const submitForm = async () => {
  if (submitting.value) return;
  submitting.value = true;

  try {
    await sendReport(form);

    // Show notification
    notify({
      group: "app",
      title: "Success",
      text: "✅ Report submitted successfully",
      type: "success",
      duration: 3000
    });

    // Clear form
    form.anonymous = "Yes";
    form.name = "";
    form.grade = "";
    form.violenceType = "";
    form.location = "";
    form.description = "";
    form.support = "";

  } catch (err) {
    notify({
      group: "app",
      title: "Error",
      text: "❌ Submission failed. Please try again.",
      type: "error",
      duration: 4000
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
  @apply w-full border border-gray-300 px-3 py-2 text-sm
         focus:outline-none focus:ring-1 focus:ring-blue-600;
}
</style>
