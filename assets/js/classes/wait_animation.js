
class WaitAnimation
{
    constructor()
    {
        this.for_block = 
        `
            <div class="spinner_wait d-flex justify-content-center p-2">
                <div class="spinner_wait_content spinner-border" role="status">
                    <span class="visually-hidden">...</span>
                </div>
            </div>
        `;
        
        this.for_select = 
        `
            <option class="d-flex justify-content-center p-2 disabled">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">...</span>
                </div>
            </option>
        `;
        
        this.for_button = 
        `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        `;
    }
}