document.addEventListener("DOMContentLoaded", function () {
  // Get references to the MIDI input and output dropdowns
  const midiInputDropdown = document.getElementById("midiInput");
  const midiOutputDropdown = document.getElementById("midiOutput");
  const reverbDisplay = document.getElementById("reverbDisplay");
  const slider = document.getElementById("reverbAmount");
  const body = document.body;

  // Initialize WebMidi
  WebMidi.enable(function (err) {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");

      // Populate the MIDI input dropdown
      WebMidi.inputs.forEach((input) => {
        const option = document.createElement("option");
        option.text = input.name;
        midiInputDropdown.add(option);
      });

      // Populate the MIDI output dropdown
      WebMidi.outputs.forEach((output) => {
        const option = document.createElement("option");
        option.text = output.name;
        midiOutputDropdown.add(option);
      });

      // Set up MIDI input event listener
      midiInputDropdown.addEventListener("change", function () {
        const selectedInput = WebMidi.getInputByName(midiInputDropdown.value);
        selectedInput.addListener("noteon", "all", function (e) {
          // Apply reverb effect and send MIDI output
          applyReverbAndSendMIDIOutput(e, slider.value);
        });
      });
    }
  });

  // Function to apply reverb effect and send MIDI output
  function applyReverbAndSendMIDIOutput(event, reverbAmount) {
    // Apply reverb effect here
    // For simplicity, let's just delay the note by a fixed time
    const delayTime = reverbAmount; // in seconds
    setTimeout(() => {
      // Send the delayed MIDI event to the output device
      const selectedOutput = WebMidi.getOutputByName(midiOutputDropdown.value);
      selectedOutput.playNote(event.note.name, event.note.octave, {
        velocity: event.rawVelocity,
      });
    }, delayTime * 1000); // Convert delay time to milliseconds

    // Calculate the blue and green components based on reverb amount
    const blue = Math.round(255 * (1 - reverbAmount / 10));
    const green = Math.round(255 * (reverbAmount / 10));
    body.style.backgroundColor = `rgb(0, ${green}, ${blue})`;
  }

  // Event listener for slider input
  slider.addEventListener("input", function () {
    // Update the display of reverb amount
    reverbDisplay.innerText = `Reverb Amount: ${slider.value} seconds`;
    // Update background color
    applyReverbAndSendMIDIOutput(null, slider.value);
  });
});
