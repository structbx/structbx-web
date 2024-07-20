
class Footers
{
    constructor()
    {
        
    }
    Footer_()
    {
        let year = new Date().getFullYear();
        $(".main_footer").append
        (`
            <div class="py-3 my-4">
                <div class="d-flex align-items-center justify-content-between small">
                    <div class="text-muted">Copyright &copy; ${year} StructBI.</div>
                    <div>
                        <a href="#">Pol&iacute;tica de privacidad</a>
                        &middot;
                        <a href="#">T&eacute;rminos y condiciones</a>
                    </div>
                </div>
            </div>
        `);
    }
}